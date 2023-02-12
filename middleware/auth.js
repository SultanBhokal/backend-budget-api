import User from "../config/model/userModel.js";
import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.json({ success: false, msg: "Please Login" }).status(403);
    }

    const decodetoken = jwt.verify(token, process.env.JWTSECRET);

    const result = await User.findById(decodetoken.id);
    
    if("_id" in result === false){
      return res.json({msg:"Please Login",isLogin:false}).status(403)
    }
    next();
  } catch (error) {
    console.log(error);
    res.json({ msg: "Please Login" + error }).status(403);
  }
};

export default isAuthenticated;
