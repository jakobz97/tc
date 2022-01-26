const jwt = require('jsonwebtoken'),
    secret = require('../config/env.config')['jwt_secret'];

/**
 * @function (01) check if the doctor has the permission to create a new user if true continue
 *           (02) this account has no permission to create a new user - throw error
 */
exports.createPermission = (req, res, next) => {
    //01
    if (req.jwt.createPermission) return next();
    //02
    return res.status(400).send();
};

/**
 * @function (01) check if the doctor has the permission to write a new record
 *           (02) this account has no write permission - return error
 */
exports.writePermission = (req, res, next) => {
    //01
    if (req.jwt.writePermission) return next();
    //02
    return res.status(400).send();
};

/**
 * @function (01) check if the doctor has the permission to read records
 *           (02) this account has no read permission - return error
 */
exports.readPermission = (req, res, next) => {
    //01
    if (req.jwt.readPermission) return next();
    //02
    return res.status(400).send();
};
