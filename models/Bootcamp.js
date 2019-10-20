const mongoose = require("mongoose")
const slugify = require("slugify")

const BootcampSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please add a name'],
		unique: true,
		trim: true,
		maxlength: [50, 'The length of the name cannot over 50 characters']
	},
	slug: String,
	description: {
		type: String,
		required: [true, 'Please add a description'],
		maxlength: [500, 'The length of the description cannot over 50 characters']
	},
	website: {
		type: String,
		match: [
		/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
		'Please add the valid URL with HTTP or HTTPS'
		]
	},
	phone: {
		type: String,
		maxlength: [20, 'Phone number can not be longer than 20 characters']
	},
	address: {
		type: String,
		required: [true, 'An address is required']
	},
	location: {
		//GeoJSON Point
		type: {
			type: String,
			enum: ['Point'],
		},
		coordinates:{
			type: [Number],
			index: '2dsphere'
		},
		formattedAddress: String,
		street: String,
		city: String,
		state: String,
		zipcode: String,
		country: String,
	},
	careers: {
		type:[String],
		required: true,
		enum: [
			'Full-Stack Development',
			'Front-end Development',
			'Data Science',
			'Computer Science',
			'Mobile Application Development',
			'Others'
		]
	},
	averageRating: {
		type: Number,
		min: [1, 'Rating minimum at 1'],
		max: [10, 'Rating maximum at 10']
	},
	averageCost: Number,
	photo: {
		type: String,
		default: 'no-photo.jpg'
	},
	housing: {
		type: Boolean,
		default: false
	},
	jobAssistance: {
		type: Boolean,
		default: false
	},
	jobGuarantee: {
		type: Boolean,
		default: false
	},
	acceptGi: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
})

// Create bootcamp slug from the name
BootcampSchema.pre('save', function(next){
	this.slug = slugify(this.name, {lower: true})
	next()
})

module.exports = mongoose.model('Bootcamp',BootcampSchema)