const mongoose = require("mongoose")

const ReviewSchema = new mongoose.Schema({
	title:{
		type: String,
		trim: true,
		required: [true, "a review title must be provided"],
		maxlength: 100
	},
	text:{
		type: String,
		required: [true, "text field must be provided"]
	},
	rating:{
		type: Number,
		min: 1,
		max: 10,
		required: [true, "add the rating between 1 and 10"]
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

// an user can only submit one review for a bootcamp
ReviewSchema.index({ bootcamp: 1, user:1 } , {unique : true})

// static method to get rating of a bootcamp and saves it
ReviewSchema.statics.getAverageRating = async function(bootcampId){
	const obj = await this.aggregate([
			{
				$match: {bootcamp: bootcampId}
			},
			{
				$group: {_id: '$bootcamp', averageRating: {$avg: '$rating'}}
			}
		])

	console.log(obj)

	try{
		await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
			averageRating: obj[0].averageRating
		})
	}catch(err){
		console.error(err)
	}
}
// call getAverageCost after saved
ReviewSchema.post("save", function(){
	this.constructor.getAverageRating(this.bootcamp)
})

// call getAverageCost before remove
ReviewSchema.pre("remove", function(){
	this.constructor.getAverageRating(this.bootcamp)
})

module.exports = mongoose.model("Review",ReviewSchema)