const mongoose = require('../../common/services/mongoose.service').mongoose;

const Schema = mongoose.Schema;
const answerReviewSchema = new Schema({
    reviewId: String,
    answers: [{
        studentId: String,
        timestamp: Number,
        codes: Object
    }]
});

const answerReview = mongoose.model('answer_reviews', answerReviewSchema);

/**
 * @function find specific review by id
 * @param id specific review id
 * @return the review data
 */
exports.findById = (id) => {
    return answerReview.findById(id);
};

// Setters ==================================================

/**
 * @function create a new answer review document
 * @param answerReviewData is the answer review body and comprises all initial data fields
 */
exports.createAnswerReview = (answerReviewData) => {
    const answerReviewRes = new answerReview(answerReviewData);
    return answerReviewRes.save();
};

/**
 * @function push as sub document into the review answer
 * @param reviewId is the Id of the review to find the document of sub documents
 * @param answer is the answer provided by the student
 */
exports.addAnswer = (reviewId, answer) => {
    //01
    return answerReview.findOneAndUpdate({
        reviewId: reviewId
    }, {
        $push: { answers: answer }
    });
};

// Delete ==================================================

/**
 * @function delete a answer review document
 * @param answerReviewId to identify a unique review
 * @return success or failure
 */
exports.removeAnswerReview = (answerReviewId) => {
    return answerReview.deleteMany({_id: answerReviewId})
};

/**
 * @function create a new id
 */
exports.createAnswerReviewId = async () => {
    return mongoose.Types.ObjectId();
};


