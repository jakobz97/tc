//File upload layer
const Multer = require('multer');
const Upload = require('../../common/middlewares/upload.middleware');
const fs = require("fs");

//Logger
const logger = require('../../common/services/logger.service');

/**
 * @function (01) upload the file
 *           (02) handle errors
 *           (03) if everything went well continue
 */
exports.fileUpload = (req, res, next) => {
    //01
    let userUploads = Upload.upload.fields([
        {name: 'profileImg', maxCount: 1}, {name: 'cv', maxCount: 1}, {name: 'voiceMessage', maxCount: 1}, {name: 'productSound', maxCount: 1}, {name: 'brochure', maxCount: 1}, {name: 'video', maxCount: 1}
    ]);
    //02
    userUploads(req, res, function (err) {
        if (err instanceof Multer.MulterError) {
            logger.error('multer error ' + err)
        } else if (err) {
            logger.error('unknown error ' + err)
        }
        //03
        next();
    })

    /*todo: delete the old file
    //todo: name each file the same - and thus make it delete safe
    if (fs.existsSync(path)) {
        // Do something
    }
     */

};
