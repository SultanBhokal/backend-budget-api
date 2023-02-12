import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import user from "./routes/userRoutes.js";
import connectDB from "./config/database.js";
import cookieParser from "cookie-parser";
import home from "./routes/limitRoutes.js";
import category from "./routes/categoryRoutes.js";
import expense from "./routes/expenseRoutes.js";


const app = express();

    env.config({path:"./config/.env"})

// app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

app.set("trust proxy", 1);
app.use(cors({
    origin: true,
    credentials: true,
}))
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

//db connection

connectDB(app)


//Routes


app.use("/api/user",user)
app.use("/api/limit",home)
app.use("/api/category",category)
app.use("/api/expenses",expense)




app.listen(process.env.PORT,()=>{
    console.log(`Listing on port ${process.env.PORT}`);
    console.log()
    
})

app.get("/",(req,res)=>{
    res.json({msg:"This is follwing structure of api",success:"true/false",isLogin:"true/false , only if try to login or register",data:"[]"});
})
