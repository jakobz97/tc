//Models
const AnswerReviewModel = require('../models/answer.review.model');

// reads ==============================================================

/**
 * @function (01)
 */
exports.getAnswerReview = async (req, res, next) => {

};

// writes =============================================================

/**
 * @function (01) create answer review entry
 *           (02) return to the gateway the different ids
 */
exports.createAnswerReview = async (req, res, next) => {
    //01
    const answerReviewData = await AnswerReviewModel.createAnswerReview(req.body);
    //02
    res.json({error_code: false, reviewId: req.body.reviewId, answerReviewId: answerReviewData._id})
};


// patch =============================================================

/**
 * @function (01) push answer into existing review entry
 *           (02) return the id of the newly created review entry
 */
exports.pushAnswerReview = async (req, res) => {
    //01
    const reviewSubId = await AnswerReviewModel.createAnswerReviewId();
    const answerReviewData = await AnswerReviewModel.addAnswer(req.body.reviewId, {
        _id: reviewSubId,
        studentId: req.body.userId,
        timestamp: Math.floor(Date.now()),
        codes: req.body.tempCodes
    });
    //02
    res.json({error_code: false, reviewId: req.body.reviewId, answerReviewId: answerReviewData._id, answerReviewSubId: reviewSubId})
};
