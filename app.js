const express = require('express')
const indexRouter = require('./routes/routing.js')
// const { auth } = require('express-openid-connect');
require('dotenv').config()
// const https = require('https')
const http = require('http')
const expressLayouts = require('express-ejs-layouts')
const minify = require('./files/minify.js')

// Express server instantiation 
const app = express()

// set templating engine
app.use(expressLayouts)
app.set('layout', './layouts/main-layout')
app.set('views', 'views')
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Static files
app.use(express.static('static'))

// Separate the index routing to the indexRouter @ ./routes/routing.js
app.use('/', indexRouter)

const serverHTTP = http.createServer(app)
// const serverHTTPS = https.createServer(options, app) // create an https server (only necessary if running server idependent of a hosting service like plesk)
var port = 80
// var portHTTPS = 443

serverHTTP.listen(port, () => console.log(`HTTP Server - Listening on port: ${port}`))

// server.listen(port, () => console.log(`HTTPS Server - Listening on port: ${portHTTPS}`)) // opens/listens on port for https server