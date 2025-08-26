const express = require('express');
const { userAuth } = require('../Middlewares/auth');
const { profileEditValidation } = require('../helpers/signUpValidation');
const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const userData = req.userData;
        res.send(userData)
    } catch (err) {
        res.status(400).send(err.message);
        console.log(err.message)
    }

})

profileRouter.patch('/profile/edit',userAuth, async (req, res) => {


    try {
        const isValidated = profileEditValidation(req)
        if (isValidated) {
            const user = req.userData;
           
            Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
            await user.save();
            res.json({
                message: `${user.firstName} ! your profile is updated`,
                data: user
            })
        }
    } catch (err) {
        res.status(400).send(err.message);
        console.log(err.message)
    }
})

module.exports = profileRouter;