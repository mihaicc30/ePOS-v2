let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const productsSchema = new Schema({
  category: {
    type: String,
    required: true,
  }
  name: {
    type: String,
    required: true,
  },
  cal: {
    type: Number,
    required: true,
    default:0,
  },
  tag: {
    type: [String],
    default: [],
  },
  stock: {
    type: Number,
    required: true,
    default:0,
  },
  ingredients: {
    type: [String],
    required: true,
    default:[],
  },
  price: {
    type: Number,
    required: true,
    default:0,
  },
  allergens: {
    type: [String],
    required: true,
    default:[],
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
    default:"defaultDish.jpg"
  },
});

var productsModel = mongoose.model("products", productsSchema, "products");

module.exports = productsModel;