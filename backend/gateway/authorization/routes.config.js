//Security layers
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const rateLimit = require('../common/middlewares/ratelimit.middleware');

//Services
const fetch = require('../common/services/fetch.service').fetch

//Routes
exports.routesConfig = (app) => {

    //Auth functions =========================================================

    /**
     * @function (01) ensure that no jwt was provided and that the login limit is not exceeded by this user
     *           (02) forward to the auth server and check credentials
     *           (03) get user data
     *           (04) return the access token and user type
     */
    app.post('/auth/', [
        //01
        ValidationMiddleware.noJwt,
        rateLimit.loginLimit,
        async (req, res) => {
            //02
            let loginData = await fetch('https://auth.icdcoder.de/auth/', 'POST', req.body)
            //03
            //let userData = await fetch(`http://localhost:3601/user/${loginData.userId}/`, 'GET')
            //let finalObj = {...loginData, ...userData};
            //delete finalObj.userId;
            //04
            res.status(200).json(loginData);
        }
    ]);

    /**
     * @function (01)
     */
    app.post('/auth/refresh/', [
    ]);

    /**
     * @function (01) ensure that the user has a valid jwt token
     *           (02) invalidate session in the auth server backend
     *           (03) return from gateway to the user
     */
    app.post('/logout/', [
        //01
        //ValidationMiddleware.reqJwt,
        async (req, res) => {
        return res.json({error_code: false})
            //02
            let logoutData = await fetch('https://auth.icdcoder.de/logout/', 'POST')
            //03
            res.status(200).json(logoutData);
        }
    ]);
};
