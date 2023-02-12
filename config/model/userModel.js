import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const usersSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        maxLength:[30,"Name Cannot be More than 30 characters"],
        minLength:[3,"Name Cannot be less than 3 characters"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter Valid Email"]

    },

    password:{
        type:String,
        required:[true,"Please Enter Your Password"],
        minLength:[6,"Shoud be greater than 5 characters"],
        select:false
    },
    createdAt:{type:Date,default:new Date()}
})

usersSchema.pre("save",async function(next){



    this.password = await bcryptjs.hash(this.password,10)

})

//jwt token


usersSchema.methods.getJWT = function(){
    return jwt.sign({id:this._id},process.env.JWTSECRET,{
        expiresIn:process.env.JWTexpires
    });
};

//compare password

usersSchema.methods.comparePassword = async function(checkPassword){
    return await bcryptjs.compare(checkPassword,this.password)
}

//decode token



export default mongoose.model("User",usersSchema);
