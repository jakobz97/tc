//Security layers
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');

//Services
const fetch = require('../common/services/fetch.service').fetch

exports.routesConfig = (app) => {

    /**
     * @function (01) ensure that the user is logged in and provides a valid jwt
     *           (02) forward to the hospital server where search for adequate codes is performed
     *           (03) return results
     */
    app.post('/code/', [
        //01
        ValidationMiddleware.reqJwt,
        async (req, res) => {
            //02
            let codeData = await fetch('https://hospital.icdcoder.de/code/', 'POST', req.body)
            //04
            res.status(200).json(codeData);
        }
    ]);

    /**
     * @function (01) ensure that the user is logged in and provides a valid jwt
     *           (02) ensure that the user is a coder and has the permission to upload a document
     *           (03) create a document with this patient record and the code overview
     *           (04) add the id of the generated code document to the coder so that this person can fast query his / her uploaded codes
     */
    app.post('/coder/upload/', [
        //01
        ValidationMiddleware.reqJwt,
        //02
        PermissionMiddleware.reqCoder,
        async (req, res) => {
            //03
            let codeUploadData = await fetch('https://review.icdcoder.de/review/', 'POST', {...req.body, ...req.jwt})
            //04 todo build api endpoint on hospital server for this
            //await fetch('http://localhost:3601/coder/uploads/', 'PATCH', req.body)
            //05
            res.json({error_code: false})
        }
    ]);

    /**
     * @function (01) ensure that the user is logged in and provides a valid jwt
     *           (02) ensure that the user is a coder and has the permission to upload a document
     *           (03) get the uploaded documents from this coder
     *           (04) return to the user
     */
    app.get('/coder/upload/', [
        //01
        ValidationMiddleware.reqJwt,
        //02
        PermissionMiddleware.reqCoder,
        async (req, res) => {
            //03
            let uploadData = await fetch('https://review.icdcoder.de/review/created/', 'POST', req.jwt)
            //04
            res.json({error_code: false, codes: uploadData.codes})
        }
    ]);

    /**
     * @function (01) ensure that the user is logged in and provides a valid jwt
     *           (02) ensure that the user is a coder and has the permission to upload a document
     *           (03) get the uploaded documents from this coder
     *           (04) return to the user
     */
    app.post('/coder/proposal/', [
        //01
        ValidationMiddleware.reqJwt,
        //02
        PermissionMiddleware.reqCoder,
        async (req, res) => {
            //03
            let proposalData = await fetch(`https://review.icdcoder.de/proposals/${req.body.reviewId}`, 'GET')
            //04
            res.json(proposalData)
        }
    ]);

    /**
     * @function (01) ensure that the user is logged in and provides a valid jwt
     *           (02) ensure that the user is a coder and has the permission to upload a document
     *           (03) send request ot the review microservice
     *           (04) return to the user
     */
    app.post('/coder/proposal/edit/', [
        //01
        ValidationMiddleware.reqJwt,
        //02
        PermissionMiddleware.reqCoder,
        async (req, res) => {
            //03
            let proposalData = await fetch(`https://review.icdcoder.de/review/proposal/edit/`, 'POST', req.body)
            //04
            res.json(proposalData);
        }
    ]);
};
