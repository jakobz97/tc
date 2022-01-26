//Models
const ProposalModel = require('../models/proposal.review.model');


// reads ==============================================================

/**
 * @function (01) get all proposals
 *           (02) return proposals
 */
exports.getProposals = async (req, res) => {
    //01
    const proposals = await ProposalModel.findByReview(req.params.reviewId);
    //02
    res.json({error_code: false, proposals: proposals});
};

/**
 * @function (01) get all proposals from this sender to this review
 *           (02) check if any of the reviews contains the exact same code proposal
 */
exports.proposalDuplicateCheck = async (req, res, next) => {
    //01
    const proposals = await ProposalModel.findByReviewSender(req.body.proposalData.reviewId, req.body.senderData.userId);
    //02
    let matches = proposals.filter(proposal => proposal.proposedCode.icdCode === req.body.proposalData.codeProposal.icdCode);
    if (matches.length > 0) return res.json({error_code: 'd_001'})
    //03
    next();
};

// writes =============================================================

/**
 * @function (01) create a new review proposal
 *           (02) return the proposal success to the gateway
 */
exports.createProposal = async (req, res) => {
    //01
    const proposalData = await ProposalModel.createProposal({
        reviewId: req.body.proposalData.reviewId,
        senderId: req.body.senderData.userId,
        proposedCode: req.body.proposalData.codeProposal,
        timestamp: Math.round((new Date()).getTime())
    })
    //02
    res.json({error_code: false, proposalData: proposalData})
};

// patch =============================================================

/**
 * @function (01) remove review proposal
 *           (02) either return to the gateway if the action was decline code - if accept code then call the next function
 */
exports.removeProposal = async (req, res, next) => {
    //01
    //await ProposalModel.removeProposal(req.body.proposalId)
    //02
    req.body.action === 'accept' ? next() : res.json({error_code: false});
};

