require('dotenv').config();

const express = require("express");

const app = express();
const db = require('./DatabaseConnection');
const jobsRoute = require('./routes/jobsRoute.js')
const userRoute = require('./routes/usersRoute.js')

const path = require('path')

app.use(express.json())
app.use('/api/jobs/', jobsRoute)
app.use('/api/users/', userRoute)

//static file
app.use(express.static(path.join(__dirname, "./client/build")))
app.get('*', function(req,res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"))
})

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));