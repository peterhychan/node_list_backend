const crypto = require("crypto")
const mongoose =require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "A name is required"]
	},
	email: {
		type: String,
		required: [true, "An email is required"],
		unique: true,
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			"A valid email is required"	
		]
	},
	role: {
		type: String,
		enum: ["user", "publisher","admin"],
		default: "user"
	},
	password: {
		type: String,
		required: [true, "A password is required"],
		minlength: 8,
		select: false
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	createdAt: {
		type: Date,
		default: Date.now
	}
})

// Encrypt password
UserSchema.pre("save", async function(next){
	if(!this.isModified("password")){
		next()
	}
	// will only run when password is edited
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT & return
UserSchema.methods.getSignedJwtToken = function(){
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE
	})
}

// Match provided password to hashed password in the db
UserSchema.methods.matchPassword = async function(enteredPassword){
	return await bcrypt.compare(enteredPassword, this.password)
}

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function(){
	let bestBefore = 60*10*1000
	// generate a token
	const resetToken = crypto.randomBytes(20).toString("hex")
	// hash token and set to resetPasswordToken field
	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex")
	// set expiration 
	this.resetPasswordExpire = Date.now() + bestBefore
	return resetToken
}

module.exports = mongoose.model("User",UserSchema)