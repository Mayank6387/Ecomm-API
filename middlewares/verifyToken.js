const jwt=require('jsonwebtoken')


const verifyToken=(req,res,next)=>{
    const token=req.header('auth-token').split(" ")[1];
    if(!token){
        return res.status(401).json({error:"Token is required"})
    }
    try{
        const verify=jwt.verify(token,process.env.SECRET_KEY)
        console.log(verify)
        req.user=verify;
        next();
    }
    catch(err){
        return res.status(401).json({error:"Invalid Token"})
    }
}

const verifyTokenAndAuth=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id===req.params.id|| req.user.isAdmin){
            next()
        }else{
            res.status(403).json({error:"You are not allowed to do this"})
        }
    })
}
module.exports={verifyToken,verifyTokenAndAuth}