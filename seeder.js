const fs = require("fs")
const mongoose = require("mongoose")
const colors = require("colors")
const dotenv = require("dotenv")

//Load .env variables
dotenv.config({path: "./config/config.env"})

//Load models
const Bootcamp = require("./models/Bootcamp")

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
})

//Read JSON documents
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))

// Import into DB
const importData = async () => {
	try{
		await Bootcamp.create(bootcamps)
		console.log("Data imported ".yellow.inverse)
		process.exit()
	}catch(err){
		console.error(err)
	}
}

// Delete data
const deleteData = async () =>{
	try{
		await Bootcamp.deleteMany()
		console.log("All data destroyed".yellow.inverse)
		process.exit()
	}catch(err){
		console.err(err)
	}
}

if(process.argv[2] === "-i"){
	// node seeder -i
	importData()
}else if(process.argv[2] === "-d"){
	// node seeder -d
	deleteData()
}