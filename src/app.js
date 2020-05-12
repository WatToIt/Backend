require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const userRouter = require('./domain/users/user.router');
const preferenceRouter = require('./domain/preferences/preference.router');
const searchRouter = require('./domain/search/search.router');


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/users", userRouter);
app.use("/api/preferences",preferenceRouter);
app.use("/api/search",searchRouter);

app.listen(process.env.APP_PORT, ()=>{
    console.log(`Server is up and running on the port: ${process.env.APP_PORT}`)
})