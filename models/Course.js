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
	},
	user:{
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: true
	},
})

// static method to get average of course tuitions
CourseSchema.statics.getAverageCost = async function(bootcampId){
	console.log("Calculate the average cost".yellow)

	const obj = await this.aggregate([
			{
				$match: {bootcamp: bootcampId}
			},
			{
				$group: {_id: '$bootcamp', averageCost: {$avg: '$tuition'}}
			}
		])

	console.log(obj)

	try{
		await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
			averageCost: Math.ceil(obj[0].averageCost /10) *10
		})
	}catch(err){
		console.error(err)
	}
}
// call getAverageCost after saved
CourseSchema.post("save", function(){
	this.constructor.getAverageCost(this.bootcamp)
})

// call getAverageCost before remove
CourseSchema.pre("remove", function(){
	this.constructor.getAverageCost(this.bootcamp)
})

module.exports = mongoose.model("Course",CourseSchema)