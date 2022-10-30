const UserModel = require('../models/UserModel')
const jwt = require('jsonwebtoken')

const { JWT_SECRET_KEY, COOKIE_NAME} = process.env;
const checkUser = (req,res,next) =>{
    const token = req.cookies[COOKIE_NAME]
    if(token){
        jwt.verify(token,JWT_SECRET_KEY, async(err, decodedToken) =>{
            if(err){
                res.json({status: false})
                next() 
            }else{

                const user = await UserModel.findById(decodedToken.id)
                if(user) res.json({status: true,user: user.email})
                else res.json({status: false})
                next()
            }
        })
    }else{
        res.json({status: false})
        next()
   }
   
}

module.exports ={
    checkUser,
}