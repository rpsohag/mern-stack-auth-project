const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signUp = async (req, res, next) => {
    const {name, email, password} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
    } catch (error) {
        console.log(error)
    }

    if(existingUser){
        return res.status(400).json({
            message: "user already exists! Login instead"
        })
    }

    const hashPassword = bcrypt.hashSync(password);
    const user = new User({
        name,
        email,
        password : hashPassword
    })

    try {
        await user.save();
    } catch (error) {
        console.log(error);
    }

    return res.status(201).json({
        message: "user created successfull",
        data: user
    })
}

const login = async (req, res, next) => {
    const {email, password} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email: email})
    } catch (error) {
        return new Error(err);        
    }
    if(!existingUser){
     return res.status(400).json({
            message: "User not found!"
        })
    }
    const isPasswordCorrect = bcrypt.compareSync(password,  existingUser.password)
    if(!isPasswordCorrect){
        return res.status(400).json({
            message: "invalid email and password"
        })
    }

    const token = jwt.sign({id: existingUser._id}, process.env.JWT_SECRET , {
        expiresIn: "1h"
    })

    console.log('Token Generated', token)

    if(req.cookies[`${existingUser._id}`]){
        req.cookies[`${existingUser._id}`] = ""
    }


    res.cookie(String(existingUser._id), token, {
        path: '/',
        expires: new Date(Date.now() + 1000 * 30),
        httpOnly: true,
        sameSite: 'lax'
    });
    return res.status(200).json({
        message: "successfully login",
        data: existingUser,
        token: token
    })
}

const verifyToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    const token = cookies.split("=")[1];
    if(!token){
       res.status(404).json({
            message: "token not found"
        })
    }
    jwt.verify(String(token), process.env.JWT_SECRET , (error, user) => {
        if(error){
        return res.status(400).json({
                message: "invalid token"
            })
        }

        req.id = user.id;
    })
    next()
}

const getUser = async (req, res, next) => {
    const userId = req.id;
    let user;
    try {
        user = await User.findById(userId, "-password");

    } catch (error) {
        return new Error(error)
    }
    if(!user){
        return res.status(404).json({
            message: "user not found"
        })
    }
    return res.status(200).json({
        data: user
    })
}

const refreshToken = (req, res, next) => {

    const cookies = req.headers.cookie;

    if(cookies){
         const prevToken = cookies.split("=")[1];
        if(!prevToken){
            return res.status(400).json({
                message: "token not valid"
            })
        }
        jwt.verify(String(prevToken), process.env.JWT_SECRET , (err,user) => {
            if(err){
                return res.status(403).json({
                    message: "authentication fail"
                })
            }

            

        // res.clearCookie(`${user.id}`);
        // res.cookies[`${user.id}`] = ""



        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET , {
            expiresIn: "1h"
        })

        res.cookie(String(user.id), token, {
            path: '/',
            expires: new Date(Date.now() + 1000 * 30),
            httpOnly: true,
            sameSite: 'lax'
        });
                 req.id = user.id;
                next()



        })




    }else{
        return res.status(400).json({
            message: "Token Not Found"
        })
    }



}

const logout = (req, res, next) => {
    const cookies = req.headers.cookie;

    if(cookies){
         const prevToken = cookies.split("=")[1];
        if(!prevToken){
            return res.status(400).json({
                message: "token not valid"
            })
        }
        jwt.verify(String(prevToken), process.env.JWT_SECRET , (err,user) => {
            if(err){
                return res.status(403).json({
                    message: "authentication fail"
                })
            }

        res.clearCookie(`${user.id}`);
        res.cookies[`${user.id}`] = ""

            return res.status(200).json({
                message: "Logout successfully"
            })
        })

    }else{
        return res.status(400).json({
            message: "Token Not Found"
        })
    }
}

exports.signUp = signUp;
exports.login = login
exports.verifyToken = verifyToken;
exports.getUser = getUser
exports.refreshToken = refreshToken
exports.logout = logout