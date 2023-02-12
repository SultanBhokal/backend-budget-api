import mongoose from "mongoose";

const expenseSchema = mongoose.Schema({
    name:{type:String, required:true},
    discription:{type:String, required:true},
    categoryId:{type:Object, required:true},
    amount:{type:Number, required:true},
    uid:{type:Object, required:true},
    date:{type:Date,default:new Date()},
    limitId:{type:Object,required:true}
})


export default mongoose.model('Expense',expenseSchema);