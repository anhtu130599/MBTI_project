"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var careerSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    personalityTypes: [{
            type: String,
            uppercase: true,
        }],
    skills: [{
            type: String,
        }],
    education: {
        type: String,
    },
    salary: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
var Career = mongoose_1.default.models.Career || mongoose_1.default.model('Career', careerSchema);
exports.default = Career;
