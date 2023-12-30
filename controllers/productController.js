const Product = require('../models/product');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Category = require('../models/category');

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
	const allCategory = await Category.find().exec();

	res.render('product_form', {
		title: 'Product form',
		categories: allCategory,
	});
});

exports.product_create_post = [
	body('name', 'Name must be specified.')
		.trim()
		.isLength({ min:1 })
		.escape(),
	body('description', 'Description must not be empty.')
		.trim()
		.isLength({ min:1 })
		.escape(),
	body('category', 'Category must not be empty.')
		.trim()
		.isLength({ min:1 })
		.escape(),
	body('price', 'Price must be a valid number.')
		.trim()
		.isNumeric()
		.escape(),
	body('stock', 'Stock must be a valid number.')
		.trim()
		.isNumeric()
		.escape(),

	asyncHandler(async (req, res, next)=> {
		const errors = validationResult(req);
		const product = new Product({
			name: req.body.name,
			description: req.body.description,
			category: req.body.category,
			price: req.body.price,
			stock: req.body.stock,
		});

		if (!errors.isEmpty()) {

			const allCategory = await Category.find().sort({ name:1 }).exec();

			res.render('product_form', {
				title: 'Product form',
				product: product,
				categories: allCategory,
				errors: errors.array(),
			});

		} else {
			await product.save();
			res.redirect(product.url);
		}
	})
];

exports.product_update_get = asyncHandler(async (req, res, next)=> {
	const [product, allCategory] = await Promise.all([
		Product.findById(req.params.id).populate('category').exec(),
		Category.find().sort({name:1}).exec(),
	]);

	if (product === null) {
		const err = new Error('Product not found');
		err.status = 404;
		return next(err);
	}

	res.render('product_form',{
		title:'Update product',
		product: product,
		categories: allCategory,
	});
});

exports.product_update_post = [
	body('name', 'Name must be specified.')
		.trim()
		.isLength({ min:1 })
		.escape(),
	body('description', 'Description must not be empty.')
		.trim()
		.isLength({ min:1 })
		.escape(),
	body('category', 'Category must not be empty.')
		.trim()
		.isLength({ min:1 })
		.escape(),
	body('price', 'Price must be a valid number.')
		.trim()
		.isNumeric()
		.escape(),
	body('stock', 'Stock must be a valid number.')
		.trim()
		.isNumeric()
		.escape(),
	
	asyncHandler(async (req, res, next)=> {
		const errors = validationResult(req);
		const product = new Product({
			name: req.body.name,
			description: req.body.description,
			category: req.body.category,
			price: req.body.price,
			stock: req.body.stock,
			_id: req.params.id,
		});

		if (!errors.isEmpty()) {
			const [product, allCategory] = await Promise.all([
				Product.findById(req.params.id).populate('category').exec(),
				Category.find().sort({name:1}).exec(),
			]);

			res.render('product_form',{
				title:'Update product',
				product: product,
				categories: allCategory,
				errors: errors.array(),
			});
			return;
		} else {
			const updatedProduct = await Product.findByIdAndUpdate(req.params.id, product, {});
			res.redirect(updatedProduct.url);
		}
	})
];

exports.product_delete_get = asyncHandler(async (req, res, next)=> {
	const product= await Product.findById(req.params.id).populate('category').exec();

	if ( product === null ) {
		res.redirect('/catalog/products');
	}

	res.render('product_delete',{
		title:'Delete product',
		product: product,
	});
});

exports.product_delete_post = asyncHandler(async (req, res, next)=> {
	const product= await Product.findById(req.params.id).populate('category').exec();
	await Product.findByIdAndDelete(req.body.productid);
	res.redirect('/catalog/products');
});