const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	name:{ type: String, required: true, maxLength: 100 },
	description:{ type: String, required: true},
	category:{ type: Schema.Types.ObjectId, ref: 'Category', required: true },
	price:{ type: Number,required: true, min: 0 },
	stock:{ type: Number, 
		required: true, 
		min: 0, 
		validate : {
			validator : Number.isInteger,
			message   : '{VALUE} is not an integer value'
		} 
	},
});

ProductSchema.virtual('url').get(function(){
	return `/catalog/product/${this._id}`;
});

module.exports = mongoose.model('Product', ProductSchema);