//Models
const InviteModel = require('../models/invite.model');
const UserModel = require('../models/user.model');

//Logger
const logger = require('../../common/services/logger.service');

//Cryptography
const crypto = require('crypto');


// reads ==============================================================

/**
 * @function (01) get the invite link by hash
 *           (02) check if the link has expired
 *           (03) return the invite link data
 */
exports.getInvites = async (req, res) => {
    //01
    const inviteData = await InviteModel.findByHash(req.params.hash)
    //02
    //if (!inviteData || inviteData.expTimestamp < (new Date() / 1000)) return res.json({error_code: 'e_005'})
    //03
    res.json({error_code: false, inviteData: inviteData})
};

/**
 * @function (01) get the id by id and check if it has expired
 *           (02) double check if the mails match
 *           (03) delete the invite link
 *           (04) merge objects
 *           (05) return to next
 */
exports.validateInvite = async (req, res, next) => {
    //01
    const inviteData = await InviteModel.findId(req.body.inviteId)
    //if (!inviteData || inviteData.expTimestamp < (new Date() / 1000)) return res.json({error_code: 'e_005'})
    //02
    if (req.body.email !== inviteData.email) return console.log('error')
    //03
    await InviteModel.removeById(req.body.inviteId)
    //03
    req.body = {email: inviteData.email, hospitalId: inviteData.hospitalId, userType: inviteData.userType};
    //05
    next();
};

// writes =============================================================

/**
 * @function (01) check if this email is already assigned to a user
 *           (02) check if there is an active invite to this email
 *           (03) create the invite - incl the activation hash
 *           (04) return the invite id and additional data
 */
exports.createInvite = async (req, res) => {
    //01
    const exUserData = await UserModel.findByEmail(req.body.email);
    if (exUserData) return res.json({error_code: 'e_001'})
    //02
    const exInviteData = await InviteModel.findByEmail(req.body.email);
    if (exInviteData) return res.json({error_code: 'e_002'})
    //03
    const activationHash = crypto.randomBytes(16).toString('hex');
    const inviteData = await InviteModel.createInvite({
        activationHash: activationHash,
        userType: req.body.user_type,
        email: req.body.email,
        expTimestamp: Math.round((Date.now() / 1000)+3600),
        hospitalId: req.body.hospitalId
    });
    //04
    res.json({error_code:false, inviteId: inviteData._id, hash: activationHash})
};

