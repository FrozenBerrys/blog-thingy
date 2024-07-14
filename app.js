require("dotenv").config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const { isActiveRoute } = require('./server/helpers/routeHelpers'); 

const mongoose = require('mongoose');
const connectDB = require('./server/config/db');
connectDB();

const app = express();

const PORT = process.env.PORT || 3000 ;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.locals.isActiveRoute = isActiveRoute; 

app.use(session({
    secret: 'frozen berries',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
      }),
}))

app.use(express.static('public'));

//Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
//defaults to rendering main.ejs instead of searching for an index.ejs in views 
app.set('view engine', 'ejs');



app.use('/', require('./server/routes/main')); 
// any request made to the root URL (/) or any subpath under / will be handled by the router exported from ./server/routes/main
app.use('/', require('./server/routes/admin')); 


app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
})