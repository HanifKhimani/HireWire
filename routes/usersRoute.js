const express = require("express");
const router = express.Router();
const User = require("../models/userModel")
const nodemailer = require("nodemailer")
const crypto = require("crypto");
const { error, info } = require("console");
require('dotenv').config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_USER, 
        pass: process.env.AUTH_PASS 
    }
});

router.post("/register", async (req, res) => {
    try {
        const newuser = new User(req.body)
        const token = crypto.randomBytes(20).toString("hex")
        newuser.verificationToken = token
        const user = await newuser.save()

        const mailOptions = {
            from: process.env.AUTH_USER,
            to: user.email,
            subject: "Account Verification",
            text: `Dear User,
            Welcome to Job Portal website! Your account has been successfully registered.
            Your Registered details are:
            Email: ${user.email}
            Password: ${user.password}
            To verify your email, click the following link: http://localhost:3000/verify/${token}`,

            html: `<p>Dear User,</p>
            <p>Welcome to Job Portal website! Your account has been successfully registered.</p>
            <p>Your Registered details are:</p>
            <ul>
            <li>Email: ${user.email}</li>
            <li>Password: ${user.password}</li>
            </ul>
            <p>To verify your email, click the following link: <a href="http://localhost:3000/verify/${token}">Verify Email</a></p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                console.log("Error sending verification email:", error);
            }
            else {
                console.log("Verification email sent:", info.response);
            }
        });

        res.send('User Created Successfully')
    } catch (error) {
        return res.status(400).json(error);
    }
});

router.post("/verify/:token", async(req,res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(404).send("Verification failed. Token not found.");
        }
        user.isVerified = true;
        await user.save();
        return res.status(200).json({ status: "success" });
    } catch (error) {
        console.error(error);
        return res.status(400).json(error);
    }
});

//**new
router.post("/forgetpassword", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            user.password = password;
            await user.save();
            return res.send('Password Updated');
        } else {
            return res.status(400).json({ message: 'Invalid User' });
        }
    } catch (error) {
        return res.status(400).json(error);
    }
});


router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email, password: req.body.password })
        if (user) {
            res.send(user)
        }
        else {
            return res.status(400).json({ message: 'Invalied User' });
        }

    } catch (error) {
        return res.status(400).json(error);
    }
});

router.post("/update", async (req, res) => {
    try {
        await User.findOneAndUpdate({ _id: req.body._id }, req.body)
        const user = await User.findOne({ _id: req.body._id })
        res.send(user)
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.get("/getallusers", async (req, res) => {

    try {
        const users = await User.find()
        res.send(users)
    } catch (error) {
        return res.status(400).json({ error });
    }
});

module.exports = router