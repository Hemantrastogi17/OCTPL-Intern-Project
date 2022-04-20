const mongoose = require('mongoose')
const {Schema} = mongoose
const UserSchema = new Schema({
    name:{
        type: String, 
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    },
    contact: {
        type: Number,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    companyName:{
        type: String,
        required: true
    },
    occupation:{
        type: String,
        required: true
    },
    experience:{
        type: Number,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
  });
  const User = mongoose.model('user',UserSchema)
  module.exports = User