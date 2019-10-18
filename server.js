const express = require('express')
const dotenv = require('dotenv')
const logger = require('./middleware/logger')
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')

// Enable .env variables
dotenv.config({ path: "./config/config.env"})

// Connect to db
connectDB()

// Route files
const bootcamps = require('./routes/bootcamps')

const app = express()

//Dev logging middleware
if(process.env.NODE_ENV ==='development'){
	app.use(morgan('dev'))
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(process.env.NODE_ENV.red.bold + " PORT: " + process.env.PORT.red.bold))

// Handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
	console.log("Error".red + err.message)

	//Close server
	server.close(()=> process.exit(1))
})