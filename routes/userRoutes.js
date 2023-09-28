const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

//////////////////////////////////
//const upload = multer({ dest: 'public/img/users' });

//////////////////////////////////
// ROUTES
const router = express.Router();

router.post('/singnup', authController.singnUp);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
// Which will only receive the email address
router.post('/forgotPassword', authController.forgotPassword);
// which will receive the token as well as the new password
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

// Actualizacion de contraseña del usuario
router.patch('/updateMyPassword', authController.updatePassword);
// Actualizando los datos del usuario
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
// Eliminando la cuenta del usuario
router.delete('/deleteMe', userController.deleteMe);
// Informacion o datos del usuario
router.get('/me', userController.getMe, userController.getUser);

////////////////////////
router.use(authController.restrictTo('admin'));

//router.param('id', userController.ckeckID);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
