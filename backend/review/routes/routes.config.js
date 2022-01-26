//Controllers
const ReviewController = require('../review/controllers/review.controller');
const AnswerReviewController = require('../review/controllers/answer.review.controller');
const ProposalReviewController = require('../review/controllers/proposal.review.controller');


exports.routesConfig = (app) => {

    //Writes ===================================

    app.post('/review/', [
        ReviewController.createReview,
        AnswerReviewController.createAnswerReview
    ]);

    app.post('/review/answer/', [
        ReviewController.updateReviewCounters,
        ReviewController.updateDeviationCounter,
        AnswerReviewController.pushAnswerReview
    ]);

    app.post('/review/proposal/', [
        ProposalReviewController.proposalDuplicateCheck,
        ReviewController.incrementProposalCounter,
        ProposalReviewController.createProposal
    ]);

    app.post('/review/proposal/edit/', [
        ReviewController.decrementProposalCounter,
        ProposalReviewController.removeProposal,
        AnswerReviewController.pushAnswerReview,
    ]);


    //Reads ====================================

    //Get specific review and answers
    app.get('/review/', [

    ]);

    //Get a list of interesting reviews (for students)
    app.post('/review/suitable/', [
        ReviewController.getReviewsSuitable
    ]);

    //Get the self created reviews (for coders)
    app.post('/review/created/', [
        ReviewController.getReviewsCreated
    ]);

    //Review analytics
    app.post('/review/analytics/', [
        ReviewController.analyseReviewList
    ]);

    //Proposals
    app.get('/proposals/:reviewId', [
        ProposalReviewController.getProposals
    ]);

    //Updates ===================================


};
