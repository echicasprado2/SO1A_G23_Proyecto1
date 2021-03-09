const mongoose = require('mongoose')

const CaseSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:String,
    location:String,
    age:Number,
    infectedtype:String,
    state:String,
    msgtype:String
},{ 
    timestamps: true 
})

module.exports = mongoose.model('Case',CaseSchema);
