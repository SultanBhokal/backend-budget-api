import categoryModel from "../config/model/categoryModel.js";
import expenseModel from "../config/model/expenseModel.js";

import getToken from "../utility/getToken.js";
import getMonthAndYear from "../utility/getMonthAndYear.js";







// <Expense Actions >


const getExpenseAll = async (req, res) =>{
    try {
        const uid = getToken(req.cookies.token);
        const limitId = req.query?.limitId;
        const result = await expenseModel.find({uid:uid.id,limitId:limitId});

        if(result && result.length === 0){
            return res.json({msg:"No expense Found",success:false}).status(400)
        }
        return res.json({msg:"Successfully found expens Records",data:result,success:true}).status(200)

    } catch (error) {
        return res.json({msg:"Something went wrong Please try again",success:false}).status(404)
    }
}


const getExpenseByDate = async (req, res) =>{
   try{
    const {startDate,endDate} = req.body;
    const uid = getToken(req.cookies.token);
    if(!startDate){
        return res.json({msg:"PLease select a date"}).status(400)
    }
    if(startDate && endDate){
        const result = await expenseModel.find({
            uid:uid.id,
            createdAt:{$gte:startDate},
            createdAt:{$lte:endDate}
        })

        
        return res.json({msg:"Successfully found",data:result})
    }
    else{
        const result = await expenseModel.find({
            createdAt:startDate
        })
        return res.json({msg:"Success",data:result}).status(200)
    }

   }
    catch (error) {
        return res.json({msg:"Something went wrong Please try again"}).status(404)
    }
}

const getExpenseByMonth = async (req,res)=>{
    try {
        const {month,year} = req.body;
        const uid = getToken(req.cookies.token);
        if(!month){
            return res.json({msg:"Please select a Month"}).status(400)
        }
        
        const result = await expenseModel.find({
            uid:uid.id,
            month:month,
            year:year
        })

        if(result && result.length>0){
            return res.json({msg:"Successfully found",data:result}).status(200)
        }
        return res.json({msg:"No records Found"}).status(400)

        
    } catch (error) {
        return res.json({msg:"Something went wrong please try again"}).status(404)
    }
}



const addExpense = async (req, res) =>{
    try {
        const uid = getToken(req.cookies.token);
        const {name,discription,categoryId,amount,date,limitId} = req.body;
    
        if(!name || !discription || !amount || !categoryId || amount <= 0 || !date || !limitId){
            return res.json({msg:"All Fields Are Required",success:false}).status(400)
        }

        const cat = await categoryModel.findOne({
            _id: categoryId
        })

        if(cat !== null){
            const result = await expenseModel.create({
                name:name,discription:discription,categoryId:categoryId,amount:amount,date:date,
                uid:uid?.id,limitId:limitId
            })
    
            return res.json({msg:"Successfully Added",data:result,success:true}).status(200)

        }
        return res.json({
            msg:"Failed",
            success:false
        }).status(400)

      
        
    } catch (error) {
        console.log(error)
        return res.json({msg:"Something went wrong Please try again",success:false}).status(404)
    }
}

const updateExpense = async (req, res) => {
    try {
        const uid = getToken(req.cookies.token);
        const {title,discription,categoryId,amount,createdAt,expenseId} = req.body;
        const month = new Date(createdAt).getMonth()

        if(!expenseId || !title || !discription || !categoryId || !amount || !createdAt || amount<=0){
            return res.json({msg:"All fields are required"}).status(400)
        }

        const result = await expenseModel.updateOne({
            _id:expenseId,
            uid:uid.id
        },
        {
            $set:{
                title:title,discription:discription,categoryId:categoryId,
                amount:amount,createdAt:createdAt
            }
        });
       
        return res.json({msg:"sucess"}).status(200)
        
    } catch (error) {
        return res.json({msg:"Something went wrong please try again"}).status(404)
    }
}


const deleteExpense = async (req,res)=>{
    try {
        const expenseId = req.query?.expenseId;
        const uid = getToken(req.cookies.token);
        if(!expenseId){
            return res.json({msg:"No expense found"}).status(400)
        }
        const result = await expenseModel.deleteOne({uid:uid.id,
            _id:expenseId
        });
        

        return res.json({msg:"sucess",success:true}).status(200)

    } catch (error) {
        return res.json({msg:"Something went wrong Please Try again"}).status(404)
    }
}


export {
    getExpenseAll,getExpenseByDate,getExpenseByMonth,addExpense,
    updateExpense,deleteExpense}