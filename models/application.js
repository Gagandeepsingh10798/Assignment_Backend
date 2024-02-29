const config = require("config");
const USER_TYPES = Object.values(config.get("USER_TYPES"));
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const ApplicationModel = new Schema({
    name: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        index: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        index: true
    },
    dob: {
        type: Date
    },
    address: {
        lat: {
            type: Number
        },
        long: {
            type: Number
        },
        address: String,
        city: String,
        state: String,
        district: String,
        country: String,
        zip: String,
    },
    phone: {
        type: String,
        trim: true,
        default: "",
        required: true,
    },
    countryCode: {
        type: String,
        trim: true,
        default: "91",
    },
    resume: {
        type: ObjectId,
        required: true,
        ref: 'documents'
    },
    docs: [
        {
            type: ObjectId,
            ref: 'documents'
        }
    ],
    description: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: ObjectId,
        ref: 'Application'
    },
    createdByType: {
        type: String,
        enum: USER_TYPES
    },
    updatedBy: {
        type: ObjectId,
        ref: 'Application'
    },
    updatedByType: {
        type: String,
        enum: USER_TYPES
    }
},
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
);

ApplicationModel.pre("find", function (next) {
    this.where({ isDeleted: false });
    next();
});


ApplicationModel.pre("findOne", function (next) {
    this.where({ isDeleted: false });
    next();
});

ApplicationModel.pre("findOneAndUpdate", function (next) {
    this.where({ isDeleted: false });
    next();
});

const Application = mongoose.model("Application", ApplicationModel);
module.exports = Application;
