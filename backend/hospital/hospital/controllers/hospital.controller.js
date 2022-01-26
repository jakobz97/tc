//Models
const HospitalModel = require('../models/hospital.model');

//Logger
const logger = require('../../common/services/logger.service');

//Data
const icd = require('../../data/icd/codes')

//Cryptography
const crypto = require('crypto');


// reads ==============================================================

/**
 * @function (01)
 */
exports.getHospital = async (req, res, next) => {

};

/**
 * @function (01) check type of code provided and set index based on this
 *           (02) search for the code in the imported array
 *           (03) return the matches
 */
exports.getCode = async (req, res) => {
    //01
    let index = req.body.type === 'id' ? 0 : 1;
    //02
    let matches = icd.filter((code) => {
        return code[index].indexOf(req.body.val) > -1;
    });
    //03
    res.json({error_code: false, matches: matches})
};

// writes =============================================================

/**
 * @function (01) check if hospital already exists and has an admin
 *           (02) if hospital was found return error code
 *           (03) if not found create hospital entry
 *           (04) append the hospital id and forward to the next user create
 */
exports.createHospital = async (req, res, next) => {
    //01
    const hospitalData = await HospitalModel.findByHospitalCode(req.body.hospitalCode);
    //02
    if (hospitalData) return res.json({error_code: 'e_001'});
    //03
    const hospitalCreateData = await HospitalModel.createHospital(req.body);
    //04
    req.body.hospitalId = hospitalCreateData._id;
    next();
};
