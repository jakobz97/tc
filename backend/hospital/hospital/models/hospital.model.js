const mongoose = require('../../common/services/mongoose.service').mongoose;

const Schema = mongoose.Schema;
const hospitalSchema = new Schema({
    hospitalName: String,
    hospitalCode: String,
    logoPath: String,
    address: {
        street: String,
        country: String,
        zip: String,
    },
    website: String,
    orgCounter: {
        type: Number,
        default: 1
    }
});

const Hospital = mongoose.model('hospitals', hospitalSchema);

/**
 * @function find hospital by code
 * @param code is the hospital code to identify if this hospital already exists and has an admin
 */
exports.findByHospitalCode = (code) => {
    return Hospital.findOne({hospitalCode: code});
};

/**
 * @function find specific hospital by id
 * @param id specific hospital id
 * @return the hospital data
 */
exports.findById = (id) => {
    return Hospital.findById(id);
};

// Setters ==================================================

/**
 * @function create a new hospital document
 * @param hospitalData is the request body and comprises all initial data fields
 */
exports.createHospital = (hospitalData) => {
    const hospital = new Hospital(hospitalData);
    return hospital.save();
};

// Updates ==================================================

/**
 * @function update one hospital by id
 * @param id to identify the hospital
 * @param hospitalData with the updated field(s)
 */
exports.patchHospital = (id, hospitalData) => {
    return Hospital.findOneAndUpdate({
        _id: id
    }, hospitalData);
};

/**
 * @function update one hospital by id and increment, decrement particular precomputed values
 * @param id to identify the user
 * @param counterName to identify which counter is modified
 * @param operation either increment or decrement counter
 * @return saved data
 */
exports.patchHospitalCounter = async (id, counterName, operation) => {
    Hospital.findById(id)
        .then((hospital) => {
            operation === 'increment' ? hospital[counterName]++ : operation === 'reset' ? hospital[counterName] = 0 : hospital[counterName]--;
            return hospital.save();
        });
};

// Delete ==================================================

/**
 * @function delete a specific user
 * @param employeeId to identify a unique user
 * @return success or failure
 */
exports.removeHospital = (employeeId) => {
    return Hospital.deleteMany({_id: employeeId})
};



