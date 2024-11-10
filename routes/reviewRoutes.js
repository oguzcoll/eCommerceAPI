const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');

router.route('/').get(getAllReviews).post(authenticateUser, createReview);
router
  .route('/:id')
  .get(getSingleReview)
  .put(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);
module.exports = router;
