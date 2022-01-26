//Controllers
const HospitalController = require('../hospital/controllers/hospital.controller');
const UserController = require('../user/controllers/user.controller');
const InviteController = require('../user/controllers/invite.controller');

exports.routesConfig = (app) => {

    //Writes ===================================

    app.post('/create/', [
        HospitalController.createHospital,
        UserController.createUser
    ]);

    app.post('/invite/', [
        InviteController.createInvite
    ]);

    app.post('/invite/validate/', [
        InviteController.validateInvite,
        UserController.createUser
    ]);

    //Reads ====================================


    //Create new user and return card data
    app.get('/hospital/', [

    ]);

    //Create new user and return card data
    app.get('/user/:id', [
        UserController.getUser
    ]);

    //Create new user and return card data
    app.get('/userList/:hospitalId', [
        UserController.getUserList
    ]);

    //Create new user and return card data
    app.get('/invite/:hash', [
        InviteController.getInvites
    ]);

    //Get the code for autocompletion
    app.post('/code/', [
        HospitalController.getCode
    ]);

    //Updates ===================================

    //Get the code for autocompletion
    app.patch('/coder/uploads/', [
        //UserController.patchUserUpload
    ]);

    //Update the student reviewed array
    app.patch('/student/reviewed/', [
        UserController.patchUserUpload
    ]);

    //Get the code for autocompletion
    app.delete('/remove/:userId', [
        UserController.removeUser
    ]);
};
