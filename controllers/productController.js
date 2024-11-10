const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { createTokenUser, attachCookiesToResponse } = require('../utils');
const path = require('path');

// create product
const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};
// get all products
const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: products.length });
};
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId }).populate('reviews');
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product with id : ${req.params.id}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};
const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product with id : ${req.params.id}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};
const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({
    _id: productId,
  });
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product with id : ${req.params.id}`
    );
  }
  await product.remove(); // you can attack middleware here
  res.status(StatusCodes.OK).json({ msg: 'Product deleted' });
};
// const deleteProduct = async (req, res) => {
//   const { id: productId } = req.params;
//   const product = await Product.findOneAndDelete({
//     _id: productId,
//   });
//   if (!product) {
//     throw new CustomError.NotFoundError(
//       `No product with id : ${req.params.id}`
//     );
//   }
//   res.status(StatusCodes.OK).json({ msg: 'Product deleted' });
// };
const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError('Please upload an image');
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please upload an image');
  }
  const maxSize = 1024 * 1024; // 1mb
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`
    );
  }
  const imagepath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  );
  await productImage.mv(imagepath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
