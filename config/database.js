import mongoose from "mongoose";

const connectDB = (app)=>{
    mongoose.set('strictQuery', true)
    mongoose.connect(process.env.DBURI).then(data=>{
        console.log(`Connections established to db ${data.connection.host}`)
       
        
    }).catch(err=>{
        console.log(`Error connecting to DB : ${err.message}`)

        
    })
}


export default connectDB;