const express = require('express')
const dotenv = require('dotenv')

// Enable .env variables
dotenv.config({ path: "./config/config.env"})

const app = express()

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(process.env.NODE_ENV + " PORT: " + process.env.PORT))