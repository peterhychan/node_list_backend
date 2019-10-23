 const crypto = require("crypto")
 const ErrorResponse = require('../utils/errorResponse')
 const asyncHandler = require("../middleware/async")
 const sendEmail = require("../utils/sendEmail")
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

 // @description Get current logged in user
 // @route 		 POST /api/v1/auth/me
 // @access		 Private
 exports.getMe = asyncHandler(async (req, res, next)=>{
 	const user = await User.findById(req.user.id)
 	res.status(200)
 		.json({ success: true, data: user})
 })

 // @description Update details of an user
 // @route 		 PUT /api/v1/auth/updatedetails
 // @access		 Private
 exports.updateDetails = asyncHandler(async (req, res, next)=>{
 	const fieldsToUpdate ={
 		name:  req.body.name,
 		email: req.body.email
 	}
 	const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
 		new: true,
 		runValidators: true
 	})
 	res.status(200)
 		.json({ success: true, data: user})
 })

 // @description Update password
 // @route 		 PUT /api/v1/auth/updatepassword
 // @access		 Private
 exports.updatePassword = asyncHandler(async (req, res, next)=>{
 	const user = await User.findById(req.user.id).select("+password")

 	// check the current password
 	if(!(await user.matchPassword(req.body.currentPassword))){
 		return next(new ErrorResponse("Password Incorrect", 401))
 	}
 	user.password= req.body.newPassword
 	await user.save()
 	sendTokenResponse(user, 200, res)
 })

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


 // @description Forget password
 // @route 		 POST /api/v1/auth/forgetpassword
 // @access		 Public
 exports.forgetPassword = asyncHandler(async (req, res, next)=>{
 	const user = await User.findById({email: req.body.email})

 	if(!user){
 		return next(new ErrorResponse("User not found.", 404))
 	}

 	// fetch RESET token
 	const resetToken = user.getResetPasswordToken()
 	await user.save({validateBeforeSave: false})
 	// create a new reset url
 	const resetUrl  = `${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${resetToken}`
 	const message = `Recently, we have received a password reset request from you. If you are the person who made the request, please make a PUT request to: \n\n ${resetUrl}`

 	try{
 		await sendEmail({
 			email: user.email,
 			subject: "Password reset token ARRIVED!",
 			message
 		})
 		res.status(200).json({ success: true, data: "Email Sent" })
 	} catch(err){
 		console.log(err)
 		user.resetPasswordToken = undefined 
 		user.resetPasswordExpire= undefined
 		await user.save({ validateBeforeSave: false})
 		return next(new ErrorResponse("Email not sent", 500))
 	}


 	res.status(200)
 		.json({ success: true, data: user})
 })


 // @description Reset password
 // @route 		 POST /api/v1/resetpassword/:resettoken
 // @access		 Public
 exports.resetPassword = asyncHandler(async (req, res, next)=>{
 	// Fetch hashed token
 	const resetPasswordToken = crypto.createHash("sha256").update(req.params.resettoken).digest("hex")

 	const user = await User.findOne({
 		resetPasswordToken,
 		resetPasswordExpire: { $gt: Date.now() }
 	})

	if(!user){
		return next(new ErrorResponse("Token Invalid", 400))
	}

	// set new password
	user.password = req.body.password
	user.resetPasswordToken = undefined 
	user.resetPasswordExpire= undefined
	await user.save()

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

 // @description Logout current user && clear cookies
 // @route 		 GET /api/v1/auth/logout
 // @access		 Private
 exports.logout = asyncHandler(async (req, res, next)=>{
 	res.cookie("token", "none", {
 		expires: new Date(Date.now()+10*1000),
 		httpOnly: true
 	})
 	res.status(200).json({ success: true, data: {}})
 })

