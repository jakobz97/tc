const mongoose = require('../../common/services/mongoose.service').mongoose;

const Schema = mongoose.Schema;
const inviteSchema = new Schema({
    activationHash: String,

    userType: String,
    email: String,

    deactivated: {
        type: Boolean,
        default: false
    },
    expTimestamp: Number,

    hospitalId: String
});

const Invite = mongoose.model('invites', inviteSchema);

/**
 * @function find  specific user by id
 * @param id specific user ident
 * @return the user data
 */
exports.findId = (id) => {
    return Invite.findById(id);
};

/**
 * @function (01) find invite by email to check if invite already exists
 * @param email is the val provided via admin invite panel
 */
exports.findByEmail = (email) => {
    return Invite.findOne({email: email});
};

/**
 * @function (01) find invite by activationHash
 * @param hash is the val provided via sign up link
 */
exports.findByHash = (hash) => {
    return Invite.findOne({activationHash: hash});
};

/**
 * @function (01) find invite by org id to list all results for the admin
 * @param orgId is the val provided via sign up link
 */
exports.findByOrg = (orgId) => {
    return Invite.findOne({senderOrgId: orgId});
};

//Writes

/**
 * @function (1) create a new invite document
 * @param inviteData is the request body and comprises all initial data fields
 * @return if save was successful so that result can be handled in a promise
 */
exports.createInvite = (inviteData) => {
    const invite = new Invite(inviteData);
    return invite.save();
};

//Patches

/**
 * @function update one invite by id
 * @param id to identify the user
 * @param inviteData with the updated field(s)
 * @return success or failure
 */
exports.patchInvite = (id, inviteData) => {
    return Invite.findOneAndUpdate({
        _id: id
    }, inviteData);
};

// Removes

/**
 * @function delete a specific invite link
 * @param inviteId to identify a unique invite
 * @return success or failure
 */
exports.removeById = (inviteId) => {
    return Invite.deleteMany({_id: inviteId})
};

