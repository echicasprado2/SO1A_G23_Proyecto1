const mongoose = require('mongoose')

const CaseSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:String,
    location:String,
    region:String,
    age:Number,
    infectedtype:String,
    state:String,
    type:String
},{ 
    timestamps: true 
})

module.exports = mongoose.model('Case',CaseSchema);
