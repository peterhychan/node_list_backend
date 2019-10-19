const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require("../models/Bootcamp")


// @description	 Get all bootcamps
// @route 		 GET /api/v1/bootcamps
// @access		 Public
exports.getBootcamps = async (req, res, next) => {
	try{
		const bootcamps = await Bootcamp.find()
		res.status(200).json({success: true, count: bootcamps.length, data: bootcamps})
	}catch(err){
		res.status(400).json({success: false})
		console.log(err)
	}
}

// @description	 Get a bootcamps
// @route 		 GET /api/v1/bootcamps/:id
// @access		 Public
exports.getBootcamp = async (req, res, next) => {
	try{
		const bootcamp = await Bootcamp.findById(req.params.id)
		if(!bootcamp){
			return next(new ErrorResponse(`Bootcamp #${req.params.id} Not Found`, 404))
		}
		res.status(200).json({success: true, data: bootcamp})
	}catch(err){
		//res.status(400).json({success: false})
		next(new ErrorResponse(`Bootcamp #${req.params.id} Not Found`, 404))
		console.log(err)
	}
}

// @description	 Create a new bootcamp
// @route 		 POST /api/v1/bootcamps
// @access		 Private
exports.createBootcamp = async (req, res, next) => {
	try{
		const bootcamp = await Bootcamp.create(req.body)
		res.status(201).json({success: true, data: bootcamp})
	}catch(err){
		res.status(400).json({success: false})
		console.log(err)
	}
}

// @description	 Update an existing bootcamp
// @route 		 PUT /api/v1/bootcamps/:id
// @access		 Private
exports.updateBootcamp = async (req, res, next) => {
	try{
		const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
		if (!bootcamp){
			return res.status(400).json({success: false})
		}
		res.status(200).json({success: true, data: bootcamp})
	}catch(err){
		res.status(400).json({success: false})
		console.log(err)
	}
}

// @description	 Delete an existing bootcamp
// @route 		 DELETE /api/v1/bootcamps/:id
// @access		 Private
exports.deleteBootcamp = async (req, res, next) => {
	try{
		const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
		if (!bootcamp){
			return res.status(400).json({success: false})
		}
		res.status(200).json({success: true, data: {}})
	}catch(err){
		res.status(400).json({success: false})
		console.log(err)
	}
}







