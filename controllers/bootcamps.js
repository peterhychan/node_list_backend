const ErrorResponse = require('../utils/errorResponse')
const geocoder = require("../utils/geocoder")
const asyncHandler = require("../middleware/async")
const Bootcamp = require("../models/Bootcamp")


// @description	 Get all bootcamps
// @route 		 GET /api/v1/bootcamps
// @access		 Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	let query 
	// make a copy of req.query
	const reqQuery = {...req.query}
	// fields to be filtered
	const removeFields = ['select', 'sort']
	// traverse over removeFields and delete them from reqQuery
	removeFields.forEach(param => delete reqQuery[param])
	// create query string
	let queryStr = JSON.stringify(reqQuery)
	// create operators ($gt, $gte and so on)
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
	// finding resource
	query = Bootcamp.find(JSON.parse(queryStr))
	// select fields 
	if(req.query.select){
		const fields = req.query.select.split(',').join(' ')
		query = query.select(fields)
	}
	// sort
	if(req.query.sort){
		const sortBy = req.query.sort.split(',').join(' ')
		query = query.sort(sortBy)
	}else{
		query = query.sort('-createdAt')
	}
	// execute the query
	const bootcamps = await query
	res.status(200).json({success: true, count: bootcamps.length, data: bootcamps})

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
	const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
	if (!bootcamp){
		return next(new ErrorResponse(`Bootcamp #${req.params.id} Not Found`, 404))
	}
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









