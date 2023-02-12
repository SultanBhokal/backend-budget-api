import jwt from "jsonwebtoken";

const getToken = (token)=>{
    return jwt.verify(token,process.env.JWTSECRET);
}

export default getToken;