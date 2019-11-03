const http = require('http');
const express=require('express');
const app=express();
const cors = require('cors');

// Envarioment
require('./config/env.js');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use((error, req, res, next) =>{
    if (error instanceof SyntaxError)res.status(400).json({message:'Error'});
    else next();
});
app.use(cors({
    origin:[process.env.CLIENT_URL,'http://localhost:3000','https://reqbin.com']
}));

// Routes
app.use(require('./routes/index'));

// Start server
var server  = require('http').createServer(app);
server.listen(process.env.PORT,process.env.HOST,(req,res)=>{
    console.log(`Servidor corriendo en http://${process.env.HOST}:${process.env.PORT}`);
});