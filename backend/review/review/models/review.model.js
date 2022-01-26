const mongoose = require('../../common/services/mongoose.service').mongoose;

const Schema = mongoose.Schema;
const reviewSchema = new Schema({
    userId: String,
    hospitalId: String,
    title: String,
    txt: String,
    tags: [String],
    initialCodes: Object,
    difficulty: String,

    reviewCounter: {
        type: Number,
        default: 1
    },
    proposalCounter: {
        type: Number,
        default: 0
    },
    codeDeviation: {
        type: Number,
        default: 0
    },

    internalOnly: String,
    timestamp: Number
});

const Review = mongoose.model('reviews', reviewSchema);

/**
 * @function find specific review by id
 * @param id specific review id
 * @return the review data
 */
exports.findById = (id) => {
    return Review.findById(id);
};

/**
 * @function find a list of reviews created by a specific creator
 * @param userId of the coder
 */
exports.findByCreator = (userId) => {
    return Review.find({userId: userId});
};

/**
 * @function find a list of reviews which are from other universities
 * @param start index of the start
 * @param hospitalId exclude all results where the hospitalIds do not ma
 */
exports.findExtReviews = async (hospitalId, start) => {
    return Review.find({ hospitalId: { $ne: hospitalId } })
        .limit(start+100)
        .skip(start)
};

/**
 * @function find a list of reviews which are from other universities
 * @param start index of the start
 * @param hospitalId is the id of the hospital
 */
exports.findIntReviews = async (hospitalId, start) => {
    return Review.find({hospitalId: hospitalId})
        .limit(start+100)
        .skip(start)
};

// Setters ==================================================

/**
 * @function create a new review document
 * @param reviewData is the review body and comprises all initial data fields
 */
exports.createReview = (reviewData) => {
    const review = new Review(reviewData);
    return review.save();
};

// Updates ==================================================

/**
 * @function update one review by id
 * @param id to identify the review
 * @param reviewData with the updated field(s)
 */
exports.patchReview = (id, reviewData) => {
    return Review.findOneAndUpdate({
        _id: id
    }, reviewData);
};

/**
 * @function update one review by id and increment, decrement particular precomputed values
 * @param id to identify the user
 * @param counterName to identify which counter is modified
 * @param operation either increment or decrement counter
 */
exports.patchReviewCounter = async (id, counterName, operation) => {
    Review.findById(id)
        .then((review) => {
            operation === 'increment' ? review[counterName]++ : operation === 'reset' ? review[counterName] = 0 : review[counterName]--;
            return review.save();
        });
};

// Delete ==================================================

/**
 * @function delete a specific review
 * @param reviewId to identify a unique review
 * @return success or failure
 */
exports.removeReview = (reviewId) => {
    return Review.deleteMany({_id: reviewId})
};



