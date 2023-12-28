const Category = require('../models/category');
const Product = require('../models/product');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.index = asyncHandler(async (req, res, next) => {
	const [
		numCategories,
		numProducts,
	] = await Promise.all([
		Category.countDocuments({}).exec(),
		Product.countDocuments({}).exec(),
	]);

	res.render('index', {
		title: 'Inventory Application',
		category_count: numCategories,
		product_count: numProducts,
	});
});

exports.category_list = asyncHandler(async (req, res, next) => {
	const allCategory = await Category.find({}, 'name description').sort({ name:1 }).exec();

	res.render('category_list',{
		title: 'Category list',
		category_list: allCategory,
	});
});

exports.category_details = asyncHandler(async (req, res, next)=> {
	const [
		category,
		productsInCategory
	] = await Promise.all([
		Category.findById(req.params.id).exec(),
		Product.find({category: req.params.id}, 'name description').exec(),
	]);

	if (category === null) {
		const err = new Error('Category not found');
		err.status = 404;
		return next(err);
	}

	res.render('category_details',{
		title: 'Category details',
		category: category,
		allProducts: productsInCategory,
	});
});

exports.category_create_get = asyncHandler(async (req, res, next)=> {
	res.render('category_form', {title: 'Create category'});
});

exports.category_create_post = asyncHandler(async (req, res, next)=> {
	res.send('post create form for category POST');
});

exports.category_update_get = asyncHandler(async (req, res, next)=> {
	res.send('display update form for category GET');
});

exports.category_update_post = asyncHandler(async (req, res, next)=> {
	res.send('post update form for category POST');
});

exports.category_delete_get = asyncHandler(async (req, res, next)=> {
	res.send('display delete form for category GET');
});

exports.category_delete_post = asyncHandler(async (req, res, next)=> {
	res.send('post delete form for category POST');
});