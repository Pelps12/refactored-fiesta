import mongoose from "mongoose";

let Schema = mongoose.Schema;

let user = new Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: false,
        unique:true
    },
    password:{
        type: String,
        required: false,
    },
    phoneNumber:{
        type: String,
        required: false,
        unique: true,
        sparse: true,
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    profilePic:{
        type: String,
        required: false
    }

});



export const User=  mongoose.models.User || mongoose.model("User", user);