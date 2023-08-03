const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    username : {type : String, require: true},
    password : {type : String, require: true},

    firstName : {type : String, default:''},
    lastName : {type : String, default:''},   
    email : {type : String, default:''},
    mobileNumber : {type : String, default:''},
    portfolio : {type : String, default:''},
    about : {type : String, default:''},
    address : {type : String, default:''},

    education : {type: [], default: ['']},
    skills : {type: [], default: ['']},
    projects : {type: [], default: ['']},
    experince : {type: [], default: ['']},

    appliedJobs : [],
    verificationToken: {type: String, default: ''},
    isVerified: {type: Boolean, default: false}

}, {timestamps: true});

const userModel = new mongoose.model('users', userSchema);
module.exports = userModel;  