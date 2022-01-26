const config = require('./common/config/env.config.js');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

//Restrict incoming requests
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://m.dev.enterprise.zurstiege.de');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    return req.method === 'OPTIONS' ? res.sendStatus(200) : next();
});

//Make the content of the data folder available
app.use(express.static('data'));

//Parsing of body in json / form data and cookies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //prev set to false

//Require all routes
const Routes = require('./routes/routes.config');

//Add routes
Routes.routesConfig(app);

app.listen(config.port, () => { //todo: change to server
    console.log('app listening at port %s', config.port);
});


