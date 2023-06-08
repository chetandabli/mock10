const { UserModel } = require("../models/userModel");
const express = require("express");
const userRouter = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

let otps = {
    
}

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'hildegard.morar@ethereal.email',
        pass: 'Smz4Hw7CRC3cPTcnhN'
    }
});

userRouter.post("/register", async(req, res)=>{
    let { username, email, password} = req.body;
    try {
        let isExist = await UserModel.find({"email": email});

        if(isExist.length != 0){
            return res.status(400).json({"msg": "please login as you already have account with us"})
        }

        bcrypt.hash(password, 5, async(err, hash) =>{
            if (err) throw err
            let num = Math.random();
            num = num*1000
            otps[email] = num
            await transporter.sendMail({
                from: '"hildegard.morar@ethereal.email', // sender address
                to: email, // list of receivers
                subject: "Hello, Your OTP is here", // Subject line
                text: "Hello world?", // plain text body
                html: `<b>ONE TIME PASSWORD:- ${num}</b>`, // html body
              });

            let newUser = new UserModel({"username": username, "email": email, "password": hash, otp: num});
            await newUser.save();

            res.status(201).json({"msg": "please verify email using link sent on your email"})
        });
    } catch (error) {
        console.log(error)
    }
});

userRouter.post("/login", async(req, res)=>{
    let {email, password} = req.body;
    try {
        let user = await UserModel.find({"email": email});

        if(user.length == 0){
            return res.status(400).json({"msg": "please register first as don't have account with us"})
        }

        // if(otps[email] != "done"){
        //     return res.status(400).json({"msg": "please verify email first"})
        // }
        let x = bcrypt.compareSync(password, user[0].password);

        if(!x){
            return res.status(400).json({"msg": "please enter correct password!"})
        }

        const token = jwt.sign({ username: user[0].username}, process.env.privateKey,{ expiresIn: '1h' });
        res.status(200).json({"token": token, "msg": "user logged in!"})
    } catch (error) {
        console.log(error)
    }
})

module.exports = {
    userRouter
}