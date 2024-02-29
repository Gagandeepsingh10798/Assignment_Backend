const config = require("config");
const USER_TYPES = config.get('USER_TYPES');
const validations = require("../validations");
const universal = require("../../utils");
const MESSAGES = require("../../constants").Messages;
const CODES = require("../../constants").Codes;
const Models = require('../../models');
const utils = require("../../utils");
const ObjectId = require('mongoose').Types.ObjectId;
const Projections = require('../projections').auth;

module.exports = {
    create: async (req, res, next) => {
        try {
            await validations.application.validateCreate(req, 'body')
            if (!req.files?.resume?.length) {
                await universal.response(res, CODES.BAD_REQUEST, MESSAGES.RESUME_IS_MISSING, {}, req.lang);
            }
            let resume = req.files.resume[0];
            resume.uploadTime = new Date()
            let s3Log = await universal.uploadFileToS3(resume)
            resume.completedTime = new Date()
            resume.s3Key = s3Log.key
            resume.documentType = "resume"
            resume = await new Models.Document(resume).save()

            req.body.resume = resume._id
            req.body.docs = []

            if (req.files.docs && req.files.docs.length) {
                const docPromises = req.files.docs.map(async (doc) => {
                    doc.uploadTime = new Date();
                    let s3Log = await universal.uploadFileToS3(doc);
                    doc.completedTime = new Date();
                    doc.s3Key = s3Log.key;
                    doc.documentType = "doc";
                    return new Models.Document(doc).save();
                });
                const docs = await Promise.all(docPromises);
                req.body.docs = docs.map(doc => doc._id);
            }

            if (req.body.dob) {
                const parts = req.body.dob.split('/'); 
                const year = parseInt(parts[2], 10);
                const month = parseInt(parts[1], 10) - 1;
                const day = parseInt(parts[0], 10);
                req.body.dob = new Date(year, month, day);
            }
            await new Models.Application(req.body).save();
            return await universal.response(res, CODES.OK, MESSAGES.APPLICATION_CREATED_SUCCESSFULLY, {}, req.lang);
        } catch (error) {
            next(error);
        }
    },
    get: async (req, res, next) => {
        try {
            let applications = await Models.Application.aggregate([
                { $match: { isDeleted: false } },
                {
                    $lookup: {
                        from: 'documents',
                        localField: 'resume',
                        foreignField: '_id',
                        as: 'resumeDoc'
                    }
                },
                {
                    $unwind: {
                        path: '$resumeDoc',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'documents',
                        localField: 'docs',
                        foreignField: '_id',
                        as: 'docsArray'
                    }
                },
                {
                    $project: {
                        name: 1,
                        email: 1,
                        dob: 1,
                        address: 1,
                        phone: 1,
                        countryCode: 1,
                        resume: '$resumeDoc',
                        docs: '$docsArray',
                        description: 1,
                        isDeleted: 1,
                        createdBy: 1,
                        createdByType: 1,
                        updatedBy: 1,
                        updatedByType: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            ]);

            return await universal.response(res, CODES.OK, MESSAGES.APPLICATIONS_FETCHED_SUCCESSFULLY, applications, req.lang);
        } catch (error) {
            next(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            let applications = await Models.Application.aggregate([
                { $match: { _id: new ObjectId(req.params.id), isDeleted: false } },
                {
                    $lookup: {
                        from: 'documents',
                        localField: 'resume',
                        foreignField: '_id',
                        as: 'resumeDoc'
                    }
                },
                {
                    $unwind: {
                        path: '$resumeDoc',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'documents',
                        localField: 'docs',
                        foreignField: '_id',
                        as: 'docsArray'
                    }
                },
                {
                    $project: {
                        name: 1,
                        email: 1,
                        dob: 1,
                        address: 1,
                        phone: 1,
                        countryCode: 1,
                        resume: '$resumeDoc',
                        docs: '$docsArray',
                        description: 1,
                        isDeleted: 1,
                        createdBy: 1,
                        createdByType: 1,
                        updatedBy: 1,
                        updatedByType: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            ]);

            return await universal.response(res, CODES.OK, MESSAGES.APPLICATIONS_FETCHED_SUCCESSFULLY, applications[0], req.lang);
        } catch (error) {
            next(error);
        }
    },
    updateById: async (req, res, next) => {
        try {
            req.body.docs = []
            if (req.files?.resume?.length) {
                let resume = req.files.resume[0];
                resume.uploadTime = new Date()
                let s3Log = await universal.uploadFileToS3(resume)
                resume.completedTime = new Date()
                resume.s3Key = s3Log.key
                resume.documentType = "resume"
                resume = await new Models.Document(resume).save()
                req.body.resume = resume._id
            }
            else {
                req.body.resume = null
            }

            if (req.files.docs && req.files.docs.length) {
                const docPromises = req.files.docs.map(async (doc) => {
                    doc.uploadTime = new Date();
                    let s3Log = await universal.uploadFileToS3(doc);
                    doc.completedTime = new Date();
                    doc.s3Key = s3Log.key;
                    doc.documentType = "doc";
                    return new Models.Document(doc).save();
                });
                const docs = await Promise.all(docPromises);
                req.body.docs = docs.map(doc => doc._id);
            }
            
            if (req.body?.existingDocs) {
                if (typeof req.body.existingDocs === 'string') {
                    req.body.existingDocs = [req.body.existingDocs];
                } else if (!Array.isArray(req.body.existingDocs)) {
                    req.body.existingDocs = [];
                }
                req.body.docs = [...(req.body.docs || []), ...req.body.existingDocs];
            }
            if (req.body.dob) {
                const parts = req.body.dob.split('/'); 
                const year = parseInt(parts[2], 10);
                const month = parseInt(parts[1], 10) - 1;
                const day = parseInt(parts[0], 10);
                req.body.dob = new Date(year, month, day);
            }
            await Models.Application.updateOne({ _id: new ObjectId(req.params.id) }, req.body)
            return await universal.response(res, CODES.OK, MESSAGES.APPLICATION_UPDATED_SUCCESSFULLY, {}, req.lang);
        } catch (error) {
            next(error);
        }
    },
    deleteById: async (req, res, next) => {
        try {
            await Models.Application.updateOne({ _id: new ObjectId(req.params.id) }, {isDeleted: true})
            return await universal.response(res, CODES.OK, MESSAGES.APPLICATION_UPDATED_SUCCESSFULLY, {}, req.lang);
        } catch (error) {
            next(error);
        }
    },
}


