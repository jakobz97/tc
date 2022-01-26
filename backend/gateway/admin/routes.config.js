//Security layers
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const rateLimit = require('../common/middlewares/ratelimit.middleware');

//Services
const fetch = require('../common/services/fetch.service').fetch

//Routes
exports.routesConfig = (app) => {

    //Sign up functions =====================================================

    /**
     * @function (01) check that user has not sent any jwt
     *           (02) perform admin creation and create the hospital - hospital server
     *           (03) merge data and perform initial authentication - authentication server
     *           (04) return jwt and user data to the user
     */
    app.post('/admin/', [
        //01
        ValidationMiddleware.noJwt,
        rateLimit.signupLimit,
        async (req, res) => {
            //02
            let hospitalData = await fetch('https://hospital.icdcoder.de/create/', 'POST', {...req.body, ...{userType: 'admin'}})
            //03
            if (!hospitalData.error_code) {
                let adminData = {...req.body, ...{userId: hospitalData.userId, hospitalId: hospitalData.hospitalId, userType: 'admin'}}
                let loginData = await fetch('https://auth.icdcoder.de/auth/create/', 'POST', adminData)
                //04
                res.status(200).json({tokenData: loginData.tokenData, userType: 'admin'});
            }
        }
    ]);


    /**
     * @function (01) check that user has sent a valid jwt and that the user is an admin
     *           (02) forward to the hospital / user server -> check if this user already exists + insert this invite into the invite table
     *           (03) check for error code and send link via email to the user
     */
    app.post('/admin/invite/', [
        //01
        ValidationMiddleware.reqJwt,
        PermissionMiddleware.reqAdmin,
        //req body -> { email: 'jakob@zurstiege.de', user_type: 'student' }
        async (req, res) => {
            //02
            let inviteData = await fetch('https://hospital.icdcoder.de/invite/', 'POST', {...req.body, ...req.jwt})
            //03
            if (!inviteData.error_code) {
                const mailData = await fetch('https://communication.icdcoder.de/mail/invite/', 'POST', {...req.body, ...{hash: inviteData.hash}})
                //04
                res.status(200).json({error_code: false, mailData: mailData});
            }
        }
    ]);

    /**
     * @function (01) check that user has sent a valid jwt and that the user is an admin
     *           (02) forward to the hospital / user server -> get userList
     *           (03) check for error code and return the userList
     */
    app.get('/admin/users/', [
        //01
        ValidationMiddleware.reqJwt,
        PermissionMiddleware.reqAdmin,
        async (req, res) => {
            //02
            let userListData = await fetch('https://hospital.icdcoder.de/userList/'+req.jwt.hospitalId, 'GET')
            //03
            res.json({userList: userListData.data, userId: req.jwt.userId})
        }
    ]);

    /**
     * @function (01) check that user has sent a valid jwt and that the user is an admin
     *           (02) forward to the hospital / user server -> remove a specific user
     *           (03) remove the authentication document for this user
     *           (04) return to gateway
     */
    app.post('/admin/remove/users/', [
        //01
        ValidationMiddleware.reqJwt,
        PermissionMiddleware.reqAdmin,
        async (req, res) => {
            //02
            await fetch('https://hospital.icdcoder.de/remove/'+req.body.userId, 'DELETE')
            //03
            await fetch('https://auth.icdcoder.de/remove/'+req.body.userId, 'DELETE')
            //04
            res.json({error_code: false, userId: req.body.userId})
        }
    ]);

    /**
     * @function (01) check validity of the invite link and create user
     *           (02) forward to auth server
     *           (03) return the access token
     */
    app.post('/invite/submit/', [
        async (req, res) => {
            //01
            const inviteData = await fetch('https://hospital.icdcoder.de/invite/validate/', 'POST', req.body)
            if (inviteData.error_code) return console.log('return error');
            //02
            let adminData = {...req.body, ...{userId: inviteData.userId, hospitalId: inviteData.hospitalId, userType: inviteData.userType}}
            let loginData = await fetch('https://auth.icdcoder.de/auth/create/', 'POST', adminData)
            //03
            res.status(200).json({tokenData: loginData.tokenData, userType: inviteData.userType});
        }
    ]);

    /**
     * @function (01) get the invite link data
     */
    app.get('/invite/validate/:hash', [
        async (req, res) => {
            //01
            let inviteData = await fetch('https://hospital.icdcoder.de/invite/'+req.params.hash, 'GET')
            res.status(200).json({...{error_code: false}, ...inviteData});
        }
    ]);



};
