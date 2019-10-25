const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");

// @desc Get reviews
// @route GET /api/v1/reviews
// @route GET /api/v1/bootcamps/:bootcampId/reviews
// @access Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc Get a single review
// @route GET /api/v1/reviews/:id
// @route GET /api/v1/bootcamps/:bootcampId/reviews
// @access Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description"
  });
  if (!review) {
    return next(new ErrorResponse(`#${req.params.id} review not found.`, 404));
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc Add a review
// @route POST /api/v1/reviews/:id
// @access Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`#${req.params.bootcampId} bootcamp not found.`, 404)
    );
  }
  const review = await Review.create(req.body);
  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc Update a review
// @route PUT /api/v1/reviews/:id
// @access Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(new ErrorResponse(`#${req.params.id} review not found.`, 404));
  }
  //ensure each review belongs to somebody
  if (!review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`Not allowed to update review #${req.params.id}`, 401)
    );
  }
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    success: true,
    data: review
  });
  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc Delete a review
// @route DELETE /api/v1/reviews/:id
// @access Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new ErrorResponse(`#${req.params.id} review not found.`, 404));
  }
  //ensure each review belongs to somebody
  if (!review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`Not allowed to update review #${req.params.id}`, 401)
    );
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
