const mongoose = require('mongoose')
const {Schema} = mongoose
const ProjectSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title:{
        type: String, 
        required: true
    },
    description:{
        type:String,
        required: true,
    },
    category:{
        type:String,
        default: "General"
    },
    startDate:{
        type: String,
       required: true
    },
    endDate:{
        type: String,
        required: true
    },
    notes:{
        type: String,
        
    }
  });
  const Projects = mongoose.model('projects',ProjectSchema)
  module.exports = Projects