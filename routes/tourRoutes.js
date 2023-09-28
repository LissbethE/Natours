const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourState,
  getMonthlyPlan,
  // checkID,
  //checkBody,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages,
} = require('../controllers/tourController');

const authController = require('../controllers/authController');
//const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

//////////////////////////////////
// T O U R S

// ROUTES

const tourRouter = express.Router();

// Nested routes with express
tourRouter.use('/:tourId/reviews', reviewRouter);

//tourRouter.route('/').get(getAllTours).post(checkBody, createTour);
tourRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours);
tourRouter.route('/tour-stats').get(getTourState);
tourRouter
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    getMonthlyPlan,
  );

// Geospatial queries: Finding tours within radius
tourRouter
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

// Geospatial aggregation: Calculating distances
tourRouter.route('/distances/:latlng/unit/:unit').get(getDistances);

tourRouter
  .route('/')
  .get(getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    createTour,
  );

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour,
  );

module.exports = tourRouter;
