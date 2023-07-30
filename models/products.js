let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const productsSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
  },
  subcategory_course: {
    type: Number,
    required: true,
  },
  imgCategory: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
    default: 0,
  },
  tag: {
    type: [String],
    default: [],
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  ingredients: {
    type: [String],
    required: true,
    default: [],
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  portionCost: {
    type: Number,
    default: 0,
  },
  priceOffer: {
    type: Number,
    default: null,
  },
  allergensList: {
    Meat: {
      type: Boolean,
      default: false,
    },
    Celery: {
      type: Boolean,
      default: false,
    },
    Crustaceans: {
      type: Boolean,
      default: false,
    },
    Fish: {
      type: Boolean,
      default: false,
    },
    Milk: {
      type: Boolean,
      default: false,
    },
    Mustard: {
      type: Boolean,
      default: false,
    },
    Peanuts: {
      type: Boolean,
      default: false,
    },
    Soybeans: {
      type: Boolean,
      default: false,
    },
    Gluten: {
      type: Boolean,
      default: false,
    },
    Egg: {
      type: Boolean,
      default: false,
    },
    Lupin: {
      type: Boolean,
      default: false,
    },
    Moluscs: {
      type: Boolean,
      default: false,
    },
    Nuts: {
      type: Boolean,
      default: false,
    },
    SesameSeeds: {
      type: Boolean,
      default: false,
    },
    Sulphur: {
      type: Boolean,
      default: false,
    },
  },
  img: {
    type: String,
    required: true,
    default: "defaultDish.jpg",
  },
  dateString: {
    type: String,
    default: new Date().toLocaleDateString(),
  },
  date: {
    type: Date,
    default: new Date().toISOString(),
  },
});

var productsModel = mongoose.model("products", productsSchema, "products");

module.exports = productsModel;
