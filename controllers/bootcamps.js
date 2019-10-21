const path = require("path")
const ErrorResponse = require('../utils/errorResponse')
const geocoder = require("../utils/geocoder")
const asyncHandler = require("../middleware/async")
const Bootcamp = require("../models/Bootcamp")


// @description	 Get all bootcamps
// @route 		 GET /api/v1/bootcamps
// @access		 Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults)
})

// @description	 Get a bootcamps
// @route 		 GET /api/v1/bootcamps/:id
// @access		 Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id)
	if(!bootcamp){
		return next(new ErrorResponse(`Bootcamp #${req.params.id} Not Found`, 404))
	}
	res.status(200).json({success: true, data: bootcamp})
})

// @description	 Create a new bootcamp
// @route 		 POST /api/v1/bootcamps
// @access		 Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body)
	res.status(201).json({success: true, data: bootcamp})
})

// @description	 Update an existing bootcamp
// @route 		 PUT /api/v1/bootcamps/:id
// @access		 Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id, req.body, {new: true, runValidators: true})
	if (!bootcamp){
		return next(new ErrorResponse(`Bootcamp #${req.params.id} Not Found`, 404))
	}
	bootcamp.remove()
	res.status(200).json({success: true, data: bootcamp})
})

// @description	 Delete an existing bootcamp
// @route 		 DELETE /api/v1/bootcamps/:id
// @access		 Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
	if (!bootcamp){
		return next(new ErrorResponse(`Bootcamp #${req.params.id} Not Found`, 404))
	}
	res.status(200).json({success: true, data: {}})
})


// @description	 Get bootcamps within the provided radius 
// @route 		 GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access		 Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
	const {zipcode, distance} = req.params

	// Get lat/lng from geocoder
	const loc = await geocoder.geocode(zipcode)
	const lat = loc[0].latitude
	const lng = loc[0].longitude

	// The radius of the Earth is 3963 miles
	const radius = distance / 3963
	const bootcamps = await Bootcamp.find({
		location: { $geoWithin: {$centerSphere: [[lng, lat], radius]}}
	})

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps
	})
})

// @description	 Upload photo for bootcamp 
// @route 		 PUT /api/v1/bootcamps/:id/photo
// @access		 Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id)
	if(!bootcamp){
		return next(
			new ErrorResponse("The Bootcamp requested not found", 404)
		)
	}

	if(!req.files){
		return next(
			new ErrorResponse("Please upload a photo", 400)
		)
	}

	const file = req.files.file

	// ensure the item uploaded is an image
	if(!file.mimetype.startsWith("image")){
		return next(new ErrorResponse("Please upload an image", 400))
	}

	// check file-size
	if(file.size>process.env.MAX_FILE_UPLOAD){
		return next(new ErrorResponse("Image uploaded is too large.", 400))
	}

	// create custom filename
	file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
		if(err){
			console.error(err)
			return next(new ErrorResponse("Image Upload Error", 500))
		}
		await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name})

	res.status(200).json({
		success: true,
		data: file.name
	})
	})
})








