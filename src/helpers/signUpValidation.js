const validator = require('validator')

const signupValidation = (data) =>{
 const {firstName,lastName,email,password} = data;

 if(!firstName ||!lastName){
    throw new Error("Name shoud not be empty")
 }else if(!validator.isEmail(email)){
    throw new Error("Email should be valid")
 }else if(!validator.isStrongPassword(password)){
    throw new Error("password should be strong")
 }else
  return data;
}
module.exports={signupValidation}