const config = require('./common/config/env.config.js');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//Restrict incoming requests
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    return req.method === 'OPTIONS' ? res.sendStatus(200) : next();
});

//Parsing of body in json / form data and cookies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //prev set to false
//app.use(cookieParser());

//Require all routes
const AuthRouter = require('./authorization/routes.config');
const AdminRouter = require('./admin/routes.config');
const CoderRouter = require('./coder/routes.config');
const StudentRouter = require('./student/routes.config');

//Add routes for auth, user and admin interactions
AuthRouter.routesConfig(app);
AdminRouter.routesConfig(app);
CoderRouter.routesConfig(app);
StudentRouter.routesConfig(app);


app.listen(config.port, () => {
    console.log('app listening at port %s', config.port);
});


