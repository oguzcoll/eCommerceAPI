const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { checkPermissions } = require('../utils');

// @desc Create a review
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

// @desc Get all reviews
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: 'product',
    select: 'name company price',
  });

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

// @desc Get single review
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id : ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

// @desc Update a review
const updateReview = async (req, res) => {
  const {
    params: { id: reviewId },
    body: { rating, title, comment },
  } = req;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id : ${reviewId}`);
  }
  checkPermissions(req.user, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();
  res.send(StatusCodes.OK).json({ msg: `${reviewId} id review updated` });
};

// @desc Delete a review
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id : ${reviewId}`);
  }
  checkPermissions(req.user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json({ msg: 'Review deleted' });
};
const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  if (!reviews) {
    throw new CustomError.NotFoundError(
      `No reviews found for product with id : ${productId}`
    );
  }
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
