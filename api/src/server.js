const express = require('express')
const port = 3000;
const routes = require('./routes/routes')
const bodyParser = require("body-parser")
const mongoose = require('mongoose')


const app = express();
const mongodbURL = 'mongodb+srv://adminsopes1p1:adminsopes1p1@cluster0.c9orq.mongodb.net/my-db?retryWrites=true&w=majority'
mongoose.connect(mongodbURL, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(routes)

app.listen(port,()=>{
	console.log(`App escuchando en http://localhost:${port}`)
})