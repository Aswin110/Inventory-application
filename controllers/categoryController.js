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

exports.category_create_post = [
	body('name' ,'Name must contain at least 3 characters')
		.trim()
		.isLength({min:3})
		.escape(),
	body('description', 'Description must contain at least 3 characters')
		.trim()
		.isLength({min:3})
		.escape(),
	
	asyncHandler(async (req, res, next)=> {
		const errors = validationResult(req);
		const category = new Category({
			name: req.body.name,
			description: req.body.description,
		});

		if (!errors.isEmpty()) {
			res.render('category_form', {
				title: 'Create category',
				category: category,
				errors: errors.array(),
			});
			return;
		} else {
			const categoryExists = await Category.findOne({name:req.body.name})
				.collation({ locale:'en', strength:2 })
				.exec();
			if (categoryExists) {
				res.redirect(categoryExists.url);
			} else {
				await category.save();
				res.redirect(category.url);
			}
		}
	})
];

exports.category_update_get = asyncHandler(async (req, res, next)=> {
	const category = await Category.findById(req.params.id).exec();

	if (category === null ){
		const err = new Error('Category not found');
		err.status = 404;
		return next(err);
	}

	res.render('category_form',{
		title: 'Update category',
		category: category,
	});
});

exports.category_update_post = [
	body('name' ,'Name must contain at least 3 characters')
		.trim()
		.isLength({min:3})
		.escape(),
	body('description', 'Description must contain at least 3 characters')
		.trim()
		.isLength({min:3})
		.escape(),

	asyncHandler(async (req, res, next)=> {
		const errors = validationResult(req);
		const category = new Category({
			name: req.body.name,
			description: req.body.description,
			_id: req.params.id,
		});
		if (!errors.isEmpty()) {
			req.render('category_form',{
				title:'Update category',
				category: category,
				errors: errors.array(),
			});
			return;
		} else {
			const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {});
			res.redirect(updatedCategory.url);
		}

	})
];

exports.category_delete_get = asyncHandler(async (req, res, next)=> {
	const [ category, categoryInProduct ] = await Promise.all([
		Category.findById(req.params.id).exec(),
		Product.find({category: req.params.id}, 'name description').exec(),
	]);

	if ( category === null ) {
		res.redirect('/catalog/categories');
	}

	res.render('category_delete',{
		title:'Delete category',
		category: category,
		category_product: categoryInProduct,
	});
});

exports.category_delete_post = asyncHandler(async (req, res, next)=> {
	const [ category, categoryInProduct ] = await Promise.all([
		Category.findById(req.params.id).exec(),
		Product.find({category: req.params.id}, 'name description').exec(),
	]);

	if ( categoryInProduct.length > 0 ) {
		res.render('category_delete',{
			title:'Delete category',
			category: category,
			category_product: categoryInProduct,
		});
		return;
	} else {
		await Category.findByIdAndDelete(req.body.categoryid);
		res.redirect('/catalog/categories');
	}
});