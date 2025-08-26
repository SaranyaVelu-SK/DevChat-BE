require('dotenv').config();
const jwt = require('jsonwebtoken');
const { UserModel } = require('../Models/userModel');
const userAuth = async (req, res, next) => {
   try {
      const { jwtToken } = req.cookies;
      if (!jwtToken) {
         throw new Error("No token available")
      }
      const decodedTokenData = await jwt.verify(jwtToken, process.env.JWT_PRIVATE_KEY);
      const userData = await UserModel.findById(decodedTokenData._id);
      if (!userData) {
         throw new Error("User not found")
      }
      req.userData = userData;
      next();
   } catch (err) {
      res.status(400).send(err.message);
      console.log(err)
   }
}
module.exports = {
   userAuth
}