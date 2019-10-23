const path =require("path")
const express = require('express')
const dotenv = require('dotenv')
const logger = require('./middleware/logger')
const morgan = require('morgan')
const colors = require('colors')
const fileupload =  require("express-fileupload")
const cookieParser = require("cookie-parser")
const connectDB = require('./config/db')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet")
const xss = require("xss-clean")
const errorHandler = require('./middleware/error')

// Enable .env variables
dotenv.config({ path: "./config/config.env"})

// Connect to db
connectDB()

// Route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')

const app = express()

// BodyParser
app.use(express.json())

// Cookie Parser
app.use(cookieParser())

//Dev logging middleware
if(process.env.NODE_ENV ==='development'){
	app.use(morgan('dev'))
}

// File upload middlware
app.use(fileupload())

// Santize data
app.use(mongoSanitize());

// Apply Helmet for setting security headers
app.use(helmet())

// Apply xss-clean to avoid XSS
app.use(xss())

// Set static folder
app.use(express.static(path.join(__dirname, "public")))

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)


// ErrorHandler Middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(process.env.NODE_ENV.red.bold + " PORT: " + process.env.PORT.red.bold))

// Handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
	console.log("Error".red + err.message)

	//Close server
	server.close(()=> process.exit(1))
})