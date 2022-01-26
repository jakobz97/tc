const mongoose = require('../../common/services/mongoose.service').mongoose;

const Schema = mongoose.Schema;
const proposalSchema = new Schema({
    reviewId: String,
    senderId: String,
    proposedCode: Object,
    timestamp: Number
});

const Proposal = mongoose.model('proposals', proposalSchema);

/**
 * @function find a list of review proposals based on the review id
 * @param reviewId is the id of the review
 */
exports.findByReview = (reviewId) => {
    return Proposal.find({reviewId: reviewId});
};

/**
 * @function find a list of review proposals based on the creator id
 * @param userId is the id of the user
 */
exports.findBySender = (userId) => {
    return Proposal.find({senderId: userId});
};

/**
 * @function find a list of review proposals based on the review id and the sender
 * @param reviewId is the id of the review
 * @param senderId is the user Id of the sender
 */
exports.findByReviewSender = (reviewId, senderId) => {
    return Proposal.find({reviewId: reviewId, senderId: senderId});
};


// Setters ==================================================

/**
 * @function create a new proposal document
 * @param proposalData is the review body and comprises all initial data fields
 */
exports.createProposal = (proposalData) => {
    const proposal = new Proposal(proposalData);
    return proposal.save();
};

// Delete ==================================================

/**
 * @function delete a specific proposal
 * @param proposalId to identify a unique proposal
 */
exports.removeProposal = (proposalId) => {
    return Proposal.deleteMany({_id: proposalId})
};



