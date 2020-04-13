require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const userRouter = require('./domain/users/user.router');


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/users", userRouter);


app.listen(process.env.APP_PORT, ()=>{
    console.log(`Server is up and running on the port: ${process.env.APP_PORT}`)
})