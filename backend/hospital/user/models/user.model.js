const mongoose = require('../../common/services/mongoose.service').mongoose;

const Schema = mongoose.Schema;
const userSchema = new Schema({
    hospitalId: String,
    userType: String,

    firstName: String,
    lastName: String,
    imgPath: String,
    currentYear: String,
    desc: String,
    email: String,

    uploads: [],
    answeredUploads: [],

    creationTimestamp: Number,
    lastLogin: Number,

    activated: Boolean,
    activationHash: String
});

const User = mongoose.model('users', userSchema);

/**
 * @function find  specific user by id
 * @param id specific user ident
 * @return the user data
 */
exports.findId = (id) => {
    return User.findById(id);
};

/**
 * @function (01) aggregate first and last name and find a matching user
 * @param val is the value provided by the full text search
 * todo: switch to elastic search and index name fields to speed up the search
 */
exports.findByName = async (val) => {
    return User.aggregate([
        {$project: { "name" : { $concat : [ "$firstName", " ", "$lastName" ] }, "firstName" : "$firstName", "lastName" : "$lastName", "imgPath" : "$imgPath"}},
        {$match: {"name": {$regex: val}}}
    ])
}

/**
 * @function (01) find user by email
 * @param email is the email provided during the sign up
 */
exports.findByEmail = (email) => {
    return User.findOne({email: email});
};

/**
 * @function (01) find users by hospitalId
 * @param hospitalId is the hospitalId of the user
 */
exports.findByHospital = (hospitalId) => {
    return User.find({hospitalId: hospitalId});
};

//Writes

/**
 * @function (1) check if the user already exists (2) add random verification token (3) create instance of the User models and save it to the database
 * @param userData is the request body and comprises all initial data fields
 * @return if save was successful so that result can be handled in a promise
 */
exports.createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

//Patches

/**
 * @function update one user by id
 * @param id to identify the user
 * @param userData with the updated field(s)
 * @return success or failure
 */
exports.patchUser = (id, userData) => {
    return User.findOneAndUpdate({
        _id: id
    }, userData);
};

/**
 * @function add review ids to the user document
 * @param userId to identify the user
 * @param reviewData are the ids of the reviewed review
 */
exports.addReview = (userId, reviewData) => {
    //01
    return User.findOneAndUpdate({
        _id: userId
    }, {
        $push: { answeredUploads: reviewData }
    });
};

/**
 * @function delete a specific user
 * @param userId to identify a unique user
 * @return success or failure
 */
exports.removeById = (userId) => {
    return User.deleteMany({_id: userId});
};

/**
 * @function get user based on security token and update the verified status
 * @param verificationToken to identify the user
 * @param userData required to update user and set to verified
 * @return success or failure
 */
exports.verifyUser = (verificationToken, userData) => {
    return User.findOneAndUpdate({
        verificationToken: verificationToken
    }, userData);
};

/**
 * @function (00) create a new object id
 *           (01) find the user and add share link as sub document
 * @param id of the user
 * @param rdString is a crypto string to later identify the link without using its object id
 * @return success or failure
 */
exports.addShareLink = async (id, rdString) => {
    //00
    const linkId = new mongoose.Types.ObjectId();
    //01
    return User.findOneAndUpdate(
        { _id: id },
        { $push: { shareLinks: {_id: linkId, hash: rdString} } }
    )
};

/**
 * @function (01) find the user and the specific share link by its object id and update the data (partially)
 * @param id is the user id
 * @param linkId id of the sub document of the link
 * @param linkData is the updated data of the link object
 */
exports.updateShareLink = (id, linkId, linkData) => {
    //01
    User.findById(id, (e, r) => {
        let subDoc = r.shareLinks.id(linkId);
        subDoc.set(linkData);
        return r.save();
    });
};

/**
 * @function (01) find the user and link sub document and remove it
 * @param id of the user
 * @param linkId is the id of the user link sub document
 * @return success or failure
 */
exports.removeShareLink = (id, linkId) => {
    //01
    return User.findOneAndUpdate({
        _id: id
    }, {
        $pull: { shareLinks: {_id: linkId }}
    }, {new:true});
};

//Helper functions =============================

/**
 * @function create user id and return it
 */
exports.createUserId = async () => {
    return mongoose.Types.ObjectId();
};


