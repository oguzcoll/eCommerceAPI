const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const Review = require('../models/Review');
const Product = require('../models/Product');

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      'You have already submitted a review for this product'
    );
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};
const getAllReviews = async (req, res) => {
  res.send('Get All Reviews');
};
const getSingleReview = async (req, res) => {
  res.send('Get Single Review');
};
const updateReview = async (req, res) => {
  res.send('Update Review');
};
const deleteReview = async (req, res) => {
  res.send('Delete Review');
};
module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
