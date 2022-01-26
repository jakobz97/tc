//Models
const UserModel = require('../models/user.model');

//Logger
const logger = require('../../common/services/logger.service');

//Cryptography
const crypto = require('crypto');


// reads ==============================================================

/**
 * @function (01) get the user via user id parameter
 *           (02) return user data to the gateway
 */
exports.getUser = async (req, res) => {
    //01
    const userData = await UserModel.findId(req.params.id)
    //02
    res.json({userData: userData});
};

/**
 * @function (01) get the userList based on hospital id
 *           (02) return userList data
 */
exports.getUserList = async (req, res) => {
    //01
    const userListData = await UserModel.findByHospital(req.params.hospitalId)
    //02
    res.json({data: userListData});
};

// writes =============================================================

/**
 * @function (01) check if this email is already assigned to a contact
 *           (02) create the user including the hospital id
 *           (03) return the user and hospital id
 */
exports.createUser = async (req, res) => {
    //01
    const exUserData = await UserModel.findByEmail(req.body.email);
    if (exUserData) return res.json({error_code: 'e_001'})
    //02
    const userData = await UserModel.createUser({...req.body, creationTimestamp:Date.now()});
    //03
    res.json({error_code:false, userId: userData._id, hospitalId: userData.hospitalId, userType: userData.userType})
};

/**
 * @function (01) remove by id and return no error code
 */
exports.removeUser = async (req, res) => {
    //01
    await UserModel.removeById(req.params.userId)
    //02
    res.json({error_code: false});
};

// updates ==============================================================

/**
 * @function (01) find the user and push into uploads or editedUploads the respective id -> based on type
 *           (02) return the success
 */
exports.patchUserUpload = async (req, res) => {
    //01
    await UserModel.addReview(req.body.userId, [[req.body.reviewId, req.body.answerReviewId, req.body.answerReviewSubId]])
    //02
    res.json({error_code: false});
}
