 const ErrorResponse = require('../utils/errorResponse')
 const asyncHandler = require("../middleware/async")
 const User = require("../models/User")

 // @description Register user
 // @route 		 POST /api/v1/auth/register
 // @access		 Public
 exports.register = asyncHandler(async (req, res, next)=>{
 	const {name, email, password, role} = req.body
 	// create user
 	const user = await User.create({
 		name, email, password, role
 	})
 	sendTokenResponse(user, 200, res)
 })

 // @description Login user
 // @route 		 POST /api/v1/auth/login
 // @access		 Public
 exports.login = asyncHandler(async (req, res, next)=>{
 	const {email, password} = req.body
 	// validate email and password
 	if(!email || !password){
 		return next(new ErrorResponse("BOTH Email and Password are required to login", 400))
 	}
 	// check whether user exists
 	const user = await User.findOne({email}).select("+password")

 	if(!user){
 		return next(new ErrorResponse("User not found", 401))
 	}
 	// check if password is correct
 	const isMatch = await user.matchPassword(password)

 	if(!isMatch){
 		return next(new ErrorResponse("Invalid Password", 401))
 	}
 	sendTokenResponse(user, 200, res)
 })

 // fetch token from model, create cookie and send response
 const sendTokenResponse = (user, statusCode, res)=>{
 	//create token
 	const token = user.getSignedJwtToken()
 	let lastingTime = process.env.JWT_COOKIE_EXPIRE*60*60*24*1000

 	const options ={
 		expires: new Date(Date.now() + lastingTime),
 		httpOnly: true
 	}

 	if(process.env.NODE_ENV === "production"){
 		options.secure = true
 	}

 	res.status(statusCode)
 		.cookie("token", token, options)
 		.json({ success: true, token})
 }