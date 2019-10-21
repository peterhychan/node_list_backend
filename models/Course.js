const mongoose = require("mongoose")

const CourseSchema = new mongoose.Schema({
	title:{
		type: String,
		trim: true,
		required: [true, "a course title must be provided"]
	},
	description:{
		type: String,
		required: [true, "a description must be provided"]
	},
	weeks:{
		type: String,
		required: [true, "Number of weeks must be provided"]
	},
	tuition:{
		type: Number,
		required: [true, "the amount of tuition must be provided"]
	},
	minimumSkill:{
		type: String,
		required: [true, "the minimum skillset must be provided"],
		enum:["beginner", "intermediate", "advanced"]
	},
	scholarshipAvailable:{
		type: Boolean,
		default: false
	},
	createdAt:{
		type: Date,
		default: Date.now
	},
	bootcamp:{
		type: mongoose.Schema.ObjectId,
		ref: "Bootcamp",
		required: true
	}
})

module.exports = mongoose.model("Course",CourseSchema)