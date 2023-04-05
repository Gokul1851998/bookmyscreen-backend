import userModel from "../model/userModel.js"
import otpGenerator from "../otpGenerator/otpGenerator.js"
import { generateToken } from "../jwtAuth/generateJwt.js"
import sendMail from "../nodeMailer/nodeMailer.js";
import bcrypt, { hash } from 'bcrypt'

export let otpVerify
export const sendOtp = (req, res) => {
    try {
        let userData = req.body
        
        let response = {}
        userModel.findOne({ signEmail: userData.signEmail }).then((user) => {
            if (user) {

                response.userExist = true
                res.status(200).json(response)
            } else {
  
                otpGenerator().then((otp) => {
                    sendMail(userData.signEmail, otp).then((result) => {
                        if (result.otpSent) {
                            otpVerify = otp
                            res.status(200).json(response)
                        } else {
                            res.status(500)
                        }
                    })
                })
            }
        })

    } catch (err) {
        res.status(500).json(err)
    }
}

export const verifyOtpAndSignUp = (req, res) => {
    try {
        const user = req.body.userSignup
        const otp = req.body.otp
        let response = {}  
        if (otp === otpVerify) {  
            
            bcrypt.hash(user.signPassword, 10).then((hash) => {
                user.signPassword = hash
                const newUser = new userModel(user)
                newUser.save().then(() => {
                    response.status = true
                    res.status(200).json(response)
                })
            })
        } else {
            response.status = false
            res.status(200).json(response)
        }
    } catch (err) {
        res.status(500)
    }
}

export const signIn = async(req, res) => {
    try {
        let response = {}
        let { loginEmail, loginPassword } = req.body
       await userModel.findOne({ signEmail: loginEmail }).then((user) => {
            if (user) {
                if (!user.block) {
                    bcrypt.compare(loginPassword, user.signPassword, function (err, result) {
                        if (result) {
                            const token = generateToken({ userId: user._id, name: user.signName, type: 'user' })
                            response.Name = user.signName
                            response.token = token
                            response.logIn = true
                            res.status(200).json(response)
                        } else {
                            response.incPass = true
                            res.status(200).json(response)
                        }
                    })
                } else {
                    response.block = true
                    res.status(200).json(response)
                }
            } else {
                response.noUser = true
                res.status(200).json(response)
            }
        })
    } catch (err) {
        res.status(500)
    }
}

