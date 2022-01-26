//Models
const ReviewModel = require('../models/review.model');
const AnswerReviewModel = require('../models/answer.review.model');

//Logger
const logger = require('../../common/services/logger.service');

//Cryptography
const crypto = require('crypto');


// reads ==============================================================

/**
 * @function (01)
 */
exports.getSpecificReview = async (req, res, next) => {

};

/**
 * @function (01) find all uploaded codes from one coder
 *           (02) return them
 */
exports.getReviewsCreated = async (req, res, next) => {
    //01
    const uploadedCodes = await ReviewModel.findByCreator(req.body.userId);
    //02
    res.json({error_code: false, codes: uploadedCodes});
};

/**
 * @function (01) search for internal reviews - given index
 *           (02) search for external reviews - given index
 *           (03) merge objects and return to the gateway
 */
exports.getReviewsSuitable = async (req, res) => {
    //01
    const extReviews = await ReviewModel.findExtReviews(req.body.hospitalId, req.body.externalIndex);
    //02
    const intReviews = await ReviewModel.findIntReviews(req.body.hospitalId, req.body.internalIndex);
    //03
    res.json({extReviews: extReviews, intReviews: intReviews});
};

/**
 * @function (00) final variables
 *           (01) iterate over review list
 *           (02) find the review and review answers
 *           (03) find the users answer to this review
 *           (04) benchmark user codes against the coder codes
 *           (05) update the global kpis
 *           (06) benchmark user codes against peer codes
 *           (07) push into the final object
 *           (08) return to the gateway

 */
exports.analyseReviewList = async (req, res, next) => {
    //00
    let reviewData = [];
    let globalKPIS = {
        totalReviews: req.body.reviewIds.length,
        totalCoderCodes: 0,
        totalFoundCodes: 0,
        avgDeviations: 0,
        avgTotalCodes: 0,
        avgTotalFoundCodes: 0,
        codesUsed: []
    }
    let coderIdentifiedCodes = [],
        studentIdentifiedCodes = [],
        deviations = [];

    //01
    for (let i = 0; i < globalKPIS.totalReviews; i++) {

        //02
        let indReview = await ReviewModel.findById(req.body.reviewIds[i][0])
        let reviewResponses = await AnswerReviewModel.findById(req.body.reviewIds[i][1])

        //03
        let userResponse = reviewResponses.answers.filter(answer => answer._id.toString() === req.body.reviewIds[i][2])[0];
        let studentCodes = userResponse.codes.map(code => code.icdCode)

        //04
        let coderCodes = indReview.initialCodes.map(code => code.icdCode)
        let coderCoverage = {
            coderCodeCounter: coderCodes.length,
            studentCodeCounter: studentCodes.length,
            mutualCounter: studentCodes.filter(x => coderCodes.includes(x)).length,
            intersect: studentCodes.filter(x => coderCodes.includes(x)),
            coderDiff: coderCodes.filter(x => !studentCodes.includes(x)),
            studentDiff: studentCodes.filter(x => !coderCodes.includes(x))
        }
        coderIdentifiedCodes.push(coderCoverage.coderCodeCounter)
        studentIdentifiedCodes.push(coderCoverage.mutualCounter)

        //05
        globalKPIS.totalCoderCodes = globalKPIS.totalCoderCodes + coderCoverage.coderCodeCounter;
        globalKPIS.totalFoundCodes = globalKPIS.totalFoundCodes + coderCoverage.intersect.length;
        globalKPIS.codesUsed.push(studentCodes)
        deviations.push(coderCoverage.studentCodeCounter - coderCoverage.coderCodeCounter)

        //06
        let studentCoverage = {
            peerFoundCodesCounter: [],
            totalReviewCounter: reviewResponses.answers.length - 1
        };
        for (let j = 0; j < studentCoverage.totalReviewCounter; j++) {
            if (reviewResponses.answers[j]._id.toString() === req.body.reviewIds[i][2]) continue;
            let peerStudentCodes = reviewResponses.answers[j].codes.map(code => code.icdCode)
            let peerStudentOverlapCounter = peerStudentCodes.filter(x => coderCodes.includes(x)).length;
            studentCoverage.peerFoundCodesCounter.push(peerStudentOverlapCounter)
        }
        studentCoverage['peerFoundCodesCounterAvg'] = studentCoverage.peerFoundCodesCounter.reduce( ( p, c ) => p + c, 0 ) / studentCoverage.peerFoundCodesCounter.length;

        //07
        reviewData.push({
            review: indReview,
            answers: reviewResponses,
            studentAnswer: userResponse,
            coderCoverage: coderCoverage,
            studentCoverage: studentCoverage
        })
    }
    globalKPIS.avgDeviations = deviations.reduce( ( p, c ) => p + c, 0 ) / deviations.length;
    globalKPIS.avgTotalCodes = coderIdentifiedCodes.reduce( ( p, c ) => p + c, 0 ) / coderIdentifiedCodes.length;
    globalKPIS.avgTotalFoundCodes = studentIdentifiedCodes.reduce( ( p, c ) => p + c, 0 ) / studentIdentifiedCodes.length;

    //08
    res.json({error_code: false, reviewData: reviewData, globalKPIS: globalKPIS})
};

// writes =============================================================

/**
 * @function (01) create a new review
 *           (02) append the review id and forward to the next review add create
 *           (03) proceed to the next step and create an answer review document
 */
exports.createReview = async (req, res, next) => {
    //01
    const reviewData = await ReviewModel.createReview({...req.body, ...{timestamp: Date.now()}});
    //02
    req.body.reviewId = reviewData._id.toString();
    //03
    next();
};


// patch =============================================================


/**
 * @function (01) find the review document and increment
 *           (02) proceed to the next function
 */
exports.updateReviewCounters = async (req, res, next) => {
    //01
    await ReviewModel.patchReviewCounter(req.body.reviewId, 'reviewCounter', 'increment');
    //02
    next();
};

/**
 * @function (01) find the review document and increment
 *           (02) proceed to the next function
 */
exports.incrementProposalCounter = async (req, res, next) => {
    //01
    await ReviewModel.patchReviewCounter(req.body.proposalData.reviewId, 'proposalCounter', 'increment');
    //02
    next();
};

/**
 * @function (01) find the review document and increment
 *           (02) proceed to the next function
 */
exports.decrementProposalCounter = async (req, res, next) => {
    //01
    await ReviewModel.patchReviewCounter(req.body.reviewId, 'proposalCounter', 'decrement');
    //02
    next();
};

/**
 * @function (01) find the review document and obtain sample solution codes and current deviation counter
 *           (02) contrast sample solution with the provided temp codes
 *           (03) compute the new average
 *           (04) update the deviation counter
 *           (05) proceed to the next function
 */
exports.updateDeviationCounter = async (req, res, next) => {
    //01
    const reviewData = await ReviewModel.findById(req.body.reviewId);
    //02
    let studentCodes = req.body.tempCodes;
    let coderCodes = reviewData.initialCodes
    //03
    let coderDiff = coderCodes.filter(x => !studentCodes.includes(x)).length,
        studentDiff = studentCodes.filter(x => !coderCodes.includes(x)).length,
        totalDiff = coderDiff + studentDiff;
    let newDeviationAvg = reviewData.codeDeviation + ((totalDiff - reviewData.codeDeviation) / reviewData.reviewCounter);
    //04
    await ReviewModel.patchReview(req.body.reviewId, {codeDeviation: newDeviationAvg});
    //05
    next();
};
