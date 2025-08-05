const mongoose = require('mongoose');
require('dotenv').config();

const dbConnectiontring =process.env.MONGODB_CONNECTION_URL;

const connectToDB = async() =>{
    await mongoose.connect(dbConnectiontring)
}
module.exports={connectToDB}