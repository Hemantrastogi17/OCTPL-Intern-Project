const mongoose = require('mongoose')
const mongoURI = "mongodb://localhost:27017/intern-project?readPreference=primary&appname=MongoDB%20Compass&ssl=false"
const connectToMongo = ()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("COnnected to mongo successfully");
    })
}

module.exports = connectToMongo