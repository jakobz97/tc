//Security layers
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');

//Services
const fetch = require('../common/services/fetch.service').fetch

exports.routesConfig = (app) => {

    //writes ========================

    /**
     * @function (01) ensure that the user is logged in and provides a valid jwt
     *           (02) ensure that the user is a coder and has the permission to upload a document
     *           (03) send the student codes to the review server where they are compared and inserted
     *           (04) patch the student object where user related answers are stored as ids
     *           (05) return the success or error - redirect to the analytics page
     */
    app.post('/student/upload/', [
        //01
        ValidationMiddleware.reqJwt,
        //02
        PermissionMiddleware.reqStudent,
        async (req, res) => {
            //03
            let uploadData = await fetch('https://review.icdcoder.de/review/answer/', 'POST', {...req.jwt, ...req.body})
            //04
            await fetch('https://hospital.icdcoder.de/student/reviewed/', 'PATCH', {...req.jwt, ...uploadData})
            //05
            res.json(uploadData)
        }
    ]);

    //reads ========================

    /**
     * @function (01) ensure that the user is logged in and provides a valid jwt
     *           (02) ensure that the user is a coder and has the permission to upload a document
     *           (03) get all relevant tasks for this user
     *           (04) return internal and external task data
     */
    app.post('/student/tasks/', [
        //01
        ValidationMiddleware.reqJwt,
        //02
        PermissionMiddleware.reqStudent,
        async (req, res) => {
            //03
            let taskData = await fetch('https://review.icdcoder.de/review/suitable/', 'POST', {...req.jwt, ...req.body})
            //04
            res.json(taskData)
        }
    ]);

    /**
     * @function (01) ensure that the user is logged in and provides a valid jwt
     *           (02) ensure that the user is a student
     *           (03) get all relevant tasks for this user and analyse them
     *           (04) return analysed data
     */
    app.post('/student/analytics/', [
        //01
        ValidationMiddleware.reqJwt,
        //02
        PermissionMiddleware.reqStudent,
        async (req, res) => {
            //03
            let analyticsTaskData = await fetch('https://review.icdcoder.de/review/analytics/', 'POST', {id: req.jwt, reviewIds: req.body})
            //04
            res.json(analyticsTaskData)
        }
    ]);

    /**
     * @function (01) ensure that the user is logged in and provides a valid jwt
     *           (02) ensure that the user is a student
     *           (03) proceed to review server where the proposal is inserted
     *           (04)
     */
    app.post('/student/proposal/', [
        //01
        ValidationMiddleware.reqJwt,
        //02
        PermissionMiddleware.reqStudent,
        async (req, res) => {
            //03
            let reviewProposalData = await fetch('https://review.icdcoder.de/review/proposal/', 'POST', {senderData: req.jwt, proposalData: req.body})
            //04
            res.json(reviewProposalData)
        }
    ]);

    /**
     * @function (01) ensure that the user is logged in and provides a valid jwt
     *           (02) get all relevant data from this user - all types
     */
    app.get('/user/', [
        //01
        ValidationMiddleware.reqJwt,
        async (req, res) => {
            //02
            const userData = await fetch(`https://hospital.icdcoder.de/user/${req.jwt.userId}/`, 'GET')
            //04
            res.json(userData)
        }
    ]);
};
