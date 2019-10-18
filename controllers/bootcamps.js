// @description	 Get all bootcamps
// @route 		 GET /api/v1/bootcamps
// @access		 Public
exports.getBootcamps = (req, res, next) => {
	res.status(200).json({success: true, msg: 'Show all bootcamps'})
}

// @description	 Get a bootcamps
// @route 		 GET /api/v1/bootcamps/:id
// @access		 Public
exports.getBootcamp = (req, res, next) => {
	res.status(200).json({success: true, msg: "Get bootcamp "+req.params.id})
}

// @description	 Create a new bootcamp
// @route 		 POST /api/v1/bootcamps
// @access		 Private
exports.createBootcamp = (req, res, next) => {
	res.status(200).json({success: true, msg: 'Create new bootcamp'})
}

// @description	 Update an existing bootcamp
// @route 		 PUT /api/v1/bootcamps/:id
// @access		 Private
exports.updateBootcamp = (req, res, next) => {
	res.status(200).json({success: true, msg: "Update bootcamp "+req.params.id})
}

// @description	 Delete an existing bootcamp
// @route 		 DELETE /api/v1/bootcamps/:id
// @access		 Private
exports.deleteBootcamp = (req, res, next) => {
	res.status(200).json({success: true, msg: "Delete bootcamp "+req.params.id})
}







