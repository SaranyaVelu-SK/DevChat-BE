const adminAuth = (req,res,next)=>{
 let token ="abs";
 let isAdminAuthorized = token === "abs"
 if(isAdminAuthorized){
    console.log("authorized!");
    next();
 }else{res.status(401).send("unauthorized access")}
}
const userAuth = (req,res,next)=>{
 let token ="abx";
 let isUserAuthorized = token === "abx"
 if(isUserAuthorized){
    console.log("authorized!");
    next();
 }else{res.status(401).send("unauthorized access")}
}
module.exports={
    adminAuth,
    userAuth
}