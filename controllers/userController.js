import User from "../config/model/userModel.js";
import jwt from "jsonwebtoken";

//registration

const registerUser = async (req, res, next) => {
  const { name, email, password,confirmPassword } = req.body;
  try {
    if(!name || !email || !password || !confirmPassword || password !== confirmPassword){
      return res.json({msg:"Please provide valid details",success:false,isLogin:false})
    }

    const findUser = await User.findOne({email:email})

    if(findUser){
      return res.json({msg:"Email Already Exists",success:false,isLogin:false})
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    

    res.status(200).json({
      success: true,
      isLogin:true,
      msg:"Succesfully registered"
    });
  } catch (error) {
    console.log("error while registering user" + error);
    res.json({ success: false, msg: "Please try again" });
  }
};

//login user

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .json({ success: true, msg: "Please Enter Email or Password",isLogin:false })
        .status(400);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .json({ success: true, msg: "Please Check email or password",isLogin:false })
        .status(400);
    }

    const passwordMatch = user.comparePassword(password);

    if (!passwordMatch) {
      return res
        .json({ success: false, msg: "Please Check email or password",isLogin:false })
        .status(400);
    }

    const token = user.getJWT();

    const options = {
      expires: new Date(Date.now() + process.env.CK_EXP * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure:true,
      sameSite:"none"
    };

   

    res.status(201).cookie('token', token, options).json({
      success: true,
      isLogin:true,data:user
    });
  } catch (error) {
    console.log("Login Error" + error);
    res.json({ success: false, msg: "Please try again" });
  }
};

const logoutUser = async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()),
    httpOnly: true,
    secure:true,
    sameSite:"none" });

  res.json({ success: true, msg: "Logout Success",isLogin:false }).status(200);
};

const isLogin = async (req, res) => {
  try {
    const { token } = req.cookies;
    
    if (!token) {
      return res.json({ success: false, msg: "Please Login",isLogin:false }).status(403);
    }
    const decodetoken = jwt.verify(token, process.env.JWTSECRET);
    const result = await User.findById(decodetoken.id);
    if(!result){
      return res.json({msg:"Please try again",isLogin:false,data:[]})
    }
    return res
      .json({
        data: { name: result?.name, email: result?.email },
        msg: "Success",
        isLogin:true
      })
      .status(200);
  } catch (error) {
    console.log(error);
    res.json({ msg: "Please try again",isLogin:false }).status(400);
  }
};

export { registerUser, loginUser, logoutUser, isLogin };
