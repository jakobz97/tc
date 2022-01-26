/**
 * All share function controllers
 */
const MailController = require('./controllers/mail.controller');
//const PhoneController = require('./controllers/phone.controller');

exports.routesConfig = (app) => {

    app.post('/mail/invite/', [
        async (req, res) => {
        await MailController.mail('../../common/templates/invite/invite.hbs', {
                verifyLink: req.body.hash,
                receiver: req.body.email
            }, `Invitation to the Coding Plattform`)
        }
    ]);

    app.post('/mail/verify/', [

    ]);
};

