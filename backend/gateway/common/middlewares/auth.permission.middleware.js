const jwt = require('jsonwebtoken'),
    secret = require('../config/env.config')['jwt_secret'];

/**
 * @function (01) check if user has admin status
 *           (02) perform the next operation
 * @return next if permission levels have been passed
 */
exports.reqAdmin = (req, res, next) => {
    //01
    if (req.jwt.userType !== 'admin') return res.status(403).send();
    //02
    return next();
};

/**
 * @function (01) check if user has coder status
 *           (02) perform the next operation
 * @return next if permission levels have been passed
 */
exports.reqCoder = (req, res, next) => {
    //01
    if (req.jwt.userType !== 'coder') return res.status(403).send();
    //02
    return next();
};

/**
 * @function (01) check if user has student status
 *           (02) perform the next operation
 * @return next if permission levels have been passed
 */
exports.reqStudent = (req, res, next) => {
    //01
    if (req.jwt.userType !== 'student') return res.status(403).send();
    //02
    return next();
};


// =========================================================











exports.minimumPermissionLevelRequired = (required_permission_level) => {
    return (req, res, next) => {
        let user_permission_level = parseInt(req.jwt.permissionLevel);
        let userId = req.jwt.userId;
        if (user_permission_level & required_permission_level) {
            return next();
        } else {
            return res.status(403).send();
        }
    };
};

exports.onlySameUserOrAdminCanDoThisAction = (req, res, next) => {



    return next();

    /*
    let user_permission_level = parseInt(req.jwt.permissionLevel);
    let userId = req.jwt.userId;
    if (req.params && req.params.userId && userId === req.params.userId) {
        return next();
    } else {
        if (user_permission_level & ADMIN_PERMISSION) {
            return next();
        } else {
            return res.status(403).send();
        }
    }
     */

};






exports.sameUserCantDoThisAction = (req, res, next) => {
    let userId = req.jwt.userId;

    if (req.params.userId !== userId) {
        return next();
    } else {
        return res.status(400).send();
    }

};
