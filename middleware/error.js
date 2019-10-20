const ErrorResponse = require("../utils/errorResponse")

const errorHandler = (err, req, res, next) => {
	let error = { ...err }
	error.message = err.message

	console.log(err)

	// Mongooose bad ObjectId
	if(err.name === 'CastError'){
		const message = `Resource #${err.value} Not Found`
		error = new ErrorResponse(message, 404)
	}

	// Mongoose repeated key
	if(err.code === 11000){
		const message = "The field provided is REPEATED."
		error= new ErrorResponse(message, 400)
	}


	//Mongoose validation error
	if(err.name === "ValidationError"){
		const message = Object.values(err.errors).map(res=> res.message)
		error = new ErrorResponse(message, 400)
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || '500 Server Error'
	})
}

module.exports = errorHandler