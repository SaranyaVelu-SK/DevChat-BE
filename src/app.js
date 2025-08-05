const express = require('express');
const app = express();
const { connectToDB } = require('./Config/database')





connectToDB().then(() => {
    console.log("database connected successfully");
    app.listen(3000, () => {
        console.log("server running successfully")
    })
}).catch((err) => {
    console.log('Error Occured', err)
})