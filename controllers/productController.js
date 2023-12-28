const Product = require('../models/product');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.product_list = asyncHandler(async (req, res, next) => {
	const allProducts = await Product.find({}, 'name description category').sort({ name:1 }).populate('category').exec();

	res.render('product_list',{
		title: 'Product list',
		product_list: allProducts,
	});
});

exports.product_details = asyncHandler(async (req, res, next)=> {
	const product = await Product.findById(req.params.id).populate('category').exec();

	res.render('product_details',{
		title: 'Product details',
		product: product,
	});
});

exports.product_create_get = asyncHandler(async (req, res, next)=> {
	res.render('product_form', {title: 'Create product'});
});

exports.product_create_post = asyncHandler(async (req, res, next)=> {
	res.send('post create form for product POST');
});

exports.product_update_get = asyncHandler(async (req, res, next)=> {
	res.send('display update form for product GET');
});

exports.product_update_post = asyncHandler(async (req, res, next)=> {
	res.send('post update form for product POST');
});

exports.product_delete_get = asyncHandler(async (req, res, next)=> {
	res.send('display delete form for product GET');
});

exports.product_delete_post = asyncHandler(async (req, res, next)=> {
	res.send('post delete form for product POST');
});