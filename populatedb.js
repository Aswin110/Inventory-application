#! /usr/bin/env node

console.log(
	'This script populates some category and products to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);
  
// Get arguments passed on command line
const userArgs = process.argv.slice(2);
  
const Category = require('./models/category');
const Product = require('./models/product');
  
const categories = [];
const products = [];
  
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
  
const mongoDB = userArgs[0];
  
main().catch((err) => console.log(err));
  
async function main() {
	console.log('Debug: About to connect');
	await mongoose.connect(mongoDB);
	console.log('Debug: Should be connected?');
	await createCategories();
	await createProducts();
	console.log('Debug: Closing mongoose');
	mongoose.connection.close();
}
  
// We pass the index to the ...Create functions so that, for example,
// categories[0] will always be the Groceries category, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate (index, name, description) {
	const categoryDetails = {
		name: name,
		description:description,
	};

	const category = new Category(categoryDetails);
	await category.save();
	categories[index] = category;
	console.log(`added category ${name}`);
}

async function productCreate (index, name, description, category, price, stock) {
	const productDetails = {
		name: name,
		description: description,
		category: category,
		price: price,
		stock: stock,
	};

	const product = new Product(productDetails);
	await product.save();
	products[index] = product;
	console.log(`added product ${name}`);
}

async function createCategories() {
	console.log('adding categories');
	await Promise.all([
		categoryCreate(0, 'Groceries', 'Food and other items can be purchased.'),
		categoryCreate(1, 'Car parts', 'This is a list of auto parts which are manufactured components of automobiles.'),
		categoryCreate(2, 'Musical instruments', 'Device for producing musical sounds.'),
	]);
}
  
async function createProducts() {
	console.log('added products');
	await Promise.all([
		productCreate(0, 
			'Milk 1L', 
			'The most hygienic liquid milk available in the market.', 
			categories[0], 
			50, 
			10),
		productCreate(1, 
			'Nescafe 190gm', 
			'100% pure coffee, classic instant coffee product.', 
			categories[0], 
			610, 
			15),
		productCreate(2, 
			'Serpentine belt', 
			'Long rubber belt along your car\'s engine that provides power to many vital components in your cars',
			categories[1],
			120,
			20),
		productCreate(3,
			'headlights', 
			'Lamps attached to thr front of a vehicle that illuminate the road ahead.',
			categories[1],
			1799,
			6),
		productCreate(4,
			'Guitar',
			'A stringed instrument with a flat body a long neck with the frets and usually six strings that are played with the fingers or with a pick.',
			categories[2],
			2300,
			2),
		productCreate(5,
			'Violin',
			'A bowed stringed instrument with a hollow wooden body and four strings.',
			categories[2],
			3000,
			4),
	]);
}