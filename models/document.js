const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const config = require("config");

const USER_TYPES = Object.values(config.get("USER_TYPES"));
const DOCUMENT_TYPES = [ ...config.get("DOCUMENT_TYPES") ];

const DocumentModel = new Schema(
  {
    etag: {
      type: String
    },
    mimetype: {
      type: String
    },
    filename: {
      type: String
    },
    fieldname: {
      type: String
    },
    encoding: {
      type: String
    },
    s3Key: {
      type: String,
      required: true,
      index: true,
    },
    label: {
      type: String,
      index: true,
    },
    originalname: {
      type: String,
      required: true,
    },
    extension: {
      type: String,
      required: true,
    },
    documentType: {
      type: String,
      enum: DOCUMENT_TYPES,
      required: true,
    },
    uploadTime: {
      type: Date,
      default: new Date()
    },
    completedTime: {
      type: Date,
      default: new Date()
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

DocumentModel.pre("find", function (next) {
  this.where({ isDeleted: false });
  next();
});

DocumentModel.pre("findOne", function (next) {
  this.where({ isDeleted: false });
  next();
});

DocumentModel.pre("findOneAndUpdate", function (next) {
  this.where({ isDeleted: false });
  next();
});

const Document = mongoose.model("Document", DocumentModel);
module.exports = Document;
