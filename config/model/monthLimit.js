import mongoose from "mongoose";

const userExpLimit = mongoose.Schema({
    limit:{type:Number, required:true},
    uid:{type:Object,required:true},
    createdAt:{type:Number,default:new Date().getTime()},
    month:{type:Date,default:new Date()},
    to:{type:Date,default:new Date()}
})


export default mongoose.model('Limit',userExpLimit);