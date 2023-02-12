import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name:{type:String, required:true},
    limit:{type:Number},
    uid:{type:Object, required:true},
    limitId:{type:Object,required:true},
    createdAt:{type:Number,default:new Date().getTime()},
})


export default mongoose.model('Category',categorySchema);