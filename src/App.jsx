import React, { useState, useEffect } from "react";
import "./App.css";

import { Routes, Route, Outlet, NavLink } from "react-router-dom";
import { auth, db, logout } from "./firebase/config.jsx";
import { useAuthState } from "react-firebase-hooks/auth";

import Layout from "./Layout";

import MenuItem from "./comp/menu/MenuItem";
import MenuItemDetails from "./comp/menu/MenuItemDetails";
import Menu from "./comp/menu/Menu";
import Auth from "./comp/auth/Auth";
import Receipts from "./comp/Receipts/Receipts";
import Profile from "./comp/profile/Profile";
import Signout from "./comp/signout/Signout";
import Basket from "./comp/basket/Basket";
import Page404 from "./comp/Page404";

// to grab from db later on
const menuitems = [
  {
    name: "Breakfast",
    img: "./assets/breakfast.jpg",
    items: [
      {
        name: "Full Breakfast",
        cal: "350 kcal",
        tag: ["bio"],
        stock: "10",
        ingredients: ["free range eggs", "sausage", "bacon", "mushroom", "tomato", "baked beans", "toast", "butter"],
        price: "10",
        img: "./assets/img-8lpKdg0FuYdFH4bJ5jvgH.jpeg",
      },
      {
        name: "Porridge",
        cal: "350 kcal",
        tag: ["bio"],
        stock: "10",
        ingredients: ["scottish oats", "milk", "honey", "wallnuts", "bannana"],
        price: "6",
        img: "./assets/img-8lpKdg0FuYdFH4bJ5jvgH.jpeg",
      },
      {
        name: "Avocado on Toast",
        cal: "350 kcal",
        tag: ["vegetarian", "vegan"],
        stock: "10",
        ingredients: ["turmeric sourdough", "smashed avocado", "lemon", "cherry tomatoes", "feta cheese", "pomegranades", "watercress", "poached egg", "crispy bacon", "pine nuts"],
        price: "9",
        img: "./assets/breakfast-avocado-toast.jpg",
      },
      {
        name: "Scrambled Eggs",
        cal: "300 kcal",
        tag: ["gluten-free"],
        stock: "10",
        ingredients: ["eggs", "salt", "pepper", "butter"],
        price: "8",
        img: "./assets/breakfast-scrambled-eggs.jpg",
      },
      {
        name: "French Toast",
        cal: "400 kcal",
        tag: [],
        stock: "10",
        ingredients: ["bread", "eggs", "milk", "cinnamon", "sugar"],
        price: "7",
        img: "./assets/breakfast-french-toast.jpg",
      },
      {
        name: "Yogurt Parfait",
        cal: "250 kcal",
        tag: ["vegetarian"],
        stock: "10",
        ingredients: ["yogurt", "granola", "mixed berries", "honey"],
        price: "6",
        img: "./assets/breakfast-yogurt-parfait.jpg",
      },
      {
        name: "Protein Pancakes",
        cal: "450 kcal",
        tag: [],
        stock: "10",
        ingredients: ["oats", "protein powder", "banana", "eggs", "milk"],
        price: "10",
        img: "./assets/breakfast-protein-pancakes.jpg",
      },
      {
        name: "Veggie Omelette",
        cal: "300 kcal",
        tag: ["vegetarian", "gluten-free"],
        stock: "10",
        ingredients: ["eggs", "bell peppers", "onions", "spinach", "cheese"],
        price: "8",
        img: "./assets/breakfast-veggie-omelette.jpg",
      },
    ],
  },
  {
    name: "Kids",
    img: "./assets/kids.jpg",
    items: [
      {
        name: "Chicken Nuggets",
        cal: "250 kcal",
        tag: [],
        stock: "10",
        ingredients: ["chicken breast", "breadcrumbs", "spices"],
        price: "5",
        img: "./assets/kids-nuggets.jpg",
      },
      {
        name: "Cheese Pizza",
        cal: "350 kcal",
        tag: ["vegetarian"],
        stock: "10",
        ingredients: ["pizza dough", "tomato sauce", "mozzarella cheese"],
        price: "7",
        img: "./assets/kids-cheese-pizza.jpg",
      },
      {
        name: "Grilled Cheese Sandwich",
        cal: "300 kcal",
        tag: ["vegetarian"],
        stock: "10",
        ingredients: ["cheddar", "cheese", "bread", "butter"],
        price: "4",
        img: "./assets/kids-grilled-cheese.jpg",
      },
      {
        name: "Peanut Butter and Jelly Sandwich",
        cal: "280 kcal",
        tag: ["vegetarian"],
        stock: "10",
        ingredients: ["peanut butter", "jelly", "bread"],
        price: "3",
        img: "./assets/kids-pbj-sandwich.jpg",
      },
      {
        name: "Macaroni and Cheese",
        cal: "450 kcal",
        tag: ["vegetarian"],
        stock: "10",
        ingredients: ["macaroni pasta", "cheddar cheese", "milk"],
        price: "7",
        img: "./assets/kids-mac-and-cheese.jpg",
      },
      {
        name: "Mini Pancakes",
        cal: "300 kcal",
        tag: ["vegetarian"],
        stock: "10",
        ingredients: ["pancake batter", "maple syrup", "fruits"],
        price: "6",
        img: "./assets/kids-mini-pancakes.jpg",
      },
    ],
  },
  {
    name: "Drinks",
    img: "./assets/drinks.jpg",
    items: [
      {
        name: "Coca-Cola",
        tag: ["carbonated", "soft drink"],
        stock: "20",
        price: "2",
        img: "./assets/coca-cola.jpg",
        calories: "140",
        ingredients: ["Carbonated water", "High fructose corn syrup", "Caramel color", "Phosphoric acid", "Natural flavors", "Caffeine"],
      },
      {
        name: "Orange Juice",
        tag: ["fruit juice", "non-alcoholic"],
        stock: "20",
        price: "3",
        img: "./assets/orange-juice.jpg",
        calories: "110",
        ingredients: ["Orange juice"],
      },
      {
        name: "Apple Juice",
        tag: ["fruit juice", "non-alcoholic"],
        stock: "20",
        price: "3",
        img: "./assets/apple-juice.jpg",
        calories: "120",
        ingredients: ["Apple juice"],
      },
      {
        name: "Lemonade",
        tag: ["carbonated", "non-alcoholic"],
        stock: "20",
        price: "3",
        img: "./assets/lemonade.jpg",
        calories: "100",
        ingredients: ["Lemon juice", "Water", "Sugar"],
      },
      {
        name: "Iced Tea",
        tag: ["beverage", "non-alcoholic"],
        stock: "20",
        price: "3",
        img: "./assets/iced-tea.jpg",
        calories: "60",
        ingredients: ["Black tea", "Water", "Sugar", "Lemon"],
      },
      {
        name: "Cucumber & Lime Water",
        tag: ["beverage", "non-alcoholic"],
        stock: "20",
        price: "1",
        img: "./assets/water.jpg",
        calories: "0",
        ingredients: ["Cucumber", "Lime", "Water"],
      },
      {
        name: "Mango Smoothie",
        tag: ["smoothie", "non-alcoholic"],
        stock: "20",
        price: "4",
        img: "./assets/mango-smoothie.jpg",
        calories: "220",
        ingredients: ["Mango", "Yogurt", "Milk", "Honey"],
      },
      {
        name: "Strawberry Banana Smoothie",
        tag: ["smoothie", "non-alcoholic"],
        stock: "20",
        price: "4",
        img: "./assets/strawberry-banana-smoothie.jpg",
        calories: "180",
        ingredients: ["Strawberries", "Banana", "Yogurt", "Milk", "Honey"],
      },
      {
        name: "Chocolate Milkshake",
        tag: ["milkshake", "non-alcoholic"],
        stock: "20",
        price: "5",
        img: "./assets/chocolate-milkshake.jpg",
        calories: "420",
        ingredients: ["Chocolate ice cream", "Milk", "Whipped cream", "Chocolate syrup"],
      },
      {
        name: "Vanilla Milkshake",
        tag: ["milkshake", "non-alcoholic"],
        stock: "20",
        price: "5",
        img: "./assets/vanilla-milkshake.jpg",
        calories: "380",
        ingredients: ["Vanilla ice cream", "Milk", "Whipped cream", "Vanilla extract"],
      },
      {
        name: "Coffee",
        tag: ["hot beverage", "caffeinated"],
        stock: "20",
        price: "3",
        img: "./assets/coffee.jpg",
        calories: "5",
        ingredients: ["Coffee beans", "Water"],
      },
      {
        name: "Hot Chocolate",
        tag: ["hot beverage", "non-alcoholic"],
        stock: "20",
        price: "4",
        img: "./assets/hot-chocolate.jpg",
        calories: "150",
        ingredients: ["Cocoa powder", "Milk", "Sugar", "Whipped cream", "Chocolate shavings"],
      },
    ],
  },
  {
    name: "Starters",
    img: "./assets/starters.jpg",
    items: [
      {
        name: "Chicken Wings",
        tag: ["chicken", "spicy"],
        stock: "20",
        price: "6",
        cal: "400",
        img: "./assets/chicken-wings.jpg",
        ingredients: ["Chicken wings", "Hot sauce", "Butter", "Salt", "Pepper"],
      },
      {
        name: "Mozzarella Sticks",
        tag: ["cheese", "crispy"],
        stock: "20",
        price: "5",
        cal: "320",
        img: "./assets/mozzarella-sticks.jpg",
        ingredients: ["Mozzarella cheese sticks", "Breadcrumbs", "Eggs", "Flour", "Marinara sauce"],
      },
      {
        name: "Garlic Bread",
        tag: ["bread", "garlic"],
        stock: "20",
        price: "4",
        cal: "280",
        img: "./assets/garlic-bread.jpg",
        ingredients: ["Baguette", "Garlic", "Butter", "Parsley", "Salt"],
      },
      {
        name: "Onion Rings",
        tag: ["onion", "crispy"],
        stock: "20",
        price: "4",
        cal: "350",
        img: "./assets/onion-rings.jpg",
        ingredients: ["Onions", "Flour", "Baking powder", "Salt", "Milk"],
      },
      {
        name: "Bruschetta",
        tag: ["tomato", "bread"],
        stock: "20",
        price: "5",
        cal: "210",
        img: "./assets/bruschetta.jpg",
        ingredients: ["Baguette", "Tomatoes", "Garlic", "Basil", "Olive oil"],
      },
      {
        name: "Shrimp Cocktail",
        tag: ["shrimp", "seafood"],
        stock: "20",
        price: "7",
        cal: "180",
        img: "./assets/shrimp-cocktail.jpg",
        ingredients: ["Shrimp", "Cocktail sauce", "Lemon", "Lettuce"],
      },
      {
        name: "Caprese Salad",
        tag: ["salad", "mozzarella"],
        stock: "20",
        price: "6",
        cal: "220",
        img: "./assets/caprese-salad.jpg",
        ingredients: ["Tomatoes", "Mozzarella cheese", "Basil", "Balsamic glaze", "Salt"],
      },
      {
        name: "Spinach Artichoke Dip",
        tag: ["dip", "vegetarian"],
        stock: "20",
        price: "6",
        cal: "320",
        img: "./assets/spinach-artichoke-dip.jpg",
        ingredients: ["Spinach", "Artichoke hearts", "Cream cheese", "Sour cream", "Parmesan cheese"],
      },
      {
        name: "Crispy Calamari",
        cal: "300 kcal",
        tag: [],
        stock: "10",
        ingredients: ["calamari rings", "flour", "spices", "lemon wedges"],
        price: "10",
        img: "./assets/starters-calamari.jpg",
      },
    ],
  },
  {
    name: "Mains",
    img: "./assets/mains.jpeg",
    items: [
      {
        name: "Grilled Salmon",
        cal: "400 kcal",
        tag: ["gluten-free"],
        stock: "10",
        ingredients: ["salmon fillet", "lemon", "dill", "olive oil", "salt", "pepper"],
        price: "15",
        img: "./assets/mains-grilled-salmon.jpg",
      },
      {
        name: "Beef Burger",
        cal: "500 kcal",
        tag: [],
        stock: "10",
        ingredients: ["beef patty", "brioche bun", "lettuce", "tomato", "onion", "cheese", "pickles"],
        price: "12",
        img: "./assets/mains-beef-burger.jpg",
      },
      {
        name: "Vegetable Stir-Fry",
        cal: "300 kcal",
        tag: ["vegetarian", "vegan"],
        stock: "10",
        ingredients: ["mixed vegetables", "tofu", "soy sauce", "ginger", "garlic", "sesame oil"],
        price: "10",
        img: "./assets/mains-vegetable-stir-fry.jpg",
      },
      {
        name: "Chicken Parmesan",
        cal: "450 kcal",
        tag: [],
        stock: "10",
        ingredients: ["chicken breast", "bread crumbs", "Parmesan cheese", "marinara sauce", "mozzarella cheese", "spaghetti"],
        price: "14",
        img: "./assets/mains-chicken-parmesan.jpg",
      },
      {
        name: "Pesto Pasta",
        cal: "380 kcal",
        tag: ["vegetarian"],
        stock: "10",
        ingredients: ["penne pasta", "basil pesto", "cherry tomatoes", "pine nuts", "Parmesan cheese"],
        price: "11",
        img: "./assets/mains-pesto-pasta.jpg",
      },
      {
        name: "Shrimp Scampi",
        cal: "320 kcal",
        tag: [],
        stock: "10",
        ingredients: ["shrimp", "garlic", "butter", "white wine", "lemon juice", "parsley", "linguine"],
        price: "16",
        img: "./assets/mains-shrimp-scampi.jpg",
      },
      {
        name: "Mushroom Risotto",
        cal: "380 kcal",
        tag: ["vegetarian"],
        stock: "10",
        ingredients: ["arborio rice", "mushrooms", "onion", "garlic", "vegetable broth", "Parmesan cheese"],
        price: "13",
        img: "./assets/mains-mushroom-risotto.jpg",
      },
      {
        name: "Grilled Chicken Caesar Salad",
        cal: "320 kcal",
        tag: [],
        stock: "10",
        ingredients: ["grilled chicken breast", "romaine lettuce", "croutons", "Parmesan cheese", "Caesar dressing"],
        price: "9",
        img: "./assets/mains-chicken-caesar-salad.jpg",
      },
      {
        name: "Beef Stroganoff",
        cal: "480 kcal",
        tag: [],
        stock: "10",
        ingredients: ["beef sirloin", "mushrooms", "onion", "garlic", "sour cream", "beef broth", "egg noodles"],
        price: "15",
        img: "./assets/mains-beef-stroganoff.jpg",
      },
      {
        name: "Fish and Chips",
        cal: "550 kcal",
        tag: [],
        stock: "10",
        ingredients: ["white fish fillets", "flour", "beer", "potatoes", "tartar sauce", "lemon wedges"],
        price: "13",
        img: "./assets/mains-fish-and-chips.jpg",
      },
      {
        name: "Eggplant Parmesan",
        cal: "420 kcal",
        tag: ["vegetarian"],
        stock: "10",
        ingredients: ["eggplant", "bread crumbs", "Parmesan cheese", "marinara sauce", "mozzarella cheese", "spaghetti"],
        price: "12",
        img: "./assets/mains-eggplant-parmesan.jpg",
      },
      {
        name: "Lemon Herb Roasted Chicken",
        cal: "400 kcal",
        tag: [],
        stock: "10",
        ingredients: ["chicken", "lemon", "rosemary", "thyme", "garlic", "butter", "potatoes", "carrots"],
        price: "16",
        img: "./assets/mains-lemon-herb-roasted-chicken.jpg",
      },
      {
        name: "Vegetable Lasagna",
        cal: "360 kcal",
        tag: ["vegetarian"],
        stock: "10",
        ingredients: ["lasagna noodles", "spinach", "mushrooms", "zucchini", "ricotta cheese", "marinara sauce", "mozzarella cheese"],
        price: "14",
        img: "./assets/mains-vegetable-lasagna.jpg",
      },
    ],
  },
  {
    name: "Desserts",
    img: "./assets/deserts.jpg",
    items: [
      {
        name: "Chocolate Brownie",
        cal: "350 kcal",
        tag: [],
        stock: "10",
        ingredients: ["chocolate", "butter", "sugar", "eggs", "flour", "vanilla extract", "walnuts"],
        price: "8",
        img: "./assets/desserts-chocolate-brownie.jpg",
      },
      {
        name: "Cheesecake",
        cal: "450 kcal",
        tag: [],
        stock: "10",
        ingredients: ["graham cracker crumbs", "butter", "cream cheese", "sugar", "sour cream", "vanilla extract", "eggs", "strawberry topping"],
        price: "8",
        img: "./assets/desserts-cheesecake.jpg",
      },
      {
        name: "Vanilla Ice Cream",
        cal: "200 kcal",
        tag: ["gluten-free"],
        stock: "10",
        ingredients: ["cream", "sugar", "vanilla extract"],
        price: "6",
        img: "./assets/desserts-vanilla-ice-cream.jpg",
      },
      {
        name: "Fruit Tart",
        cal: "250 kcal",
        tag: ["vegetarian"],
        stock: "10",
        ingredients: ["pastry dough", "pastry cream", "strawberries", "kiwi", "blueberries", "apricot glaze"],
        price: "10",
        img: "./assets/desserts-fruit-tart.jpg",
      },
      {
        name: "Tiramisu",
        cal: "320 kcal",
        tag: [],
        stock: "10",
        ingredients: ["ladyfingers", "espresso", "mascarpone cheese", "sugar", "cocoa powder", "rum or coffee liqueur"],
        price: "9",
        img: "./assets/desserts-tiramisu.jpg",
      },
      {
        name: "Strawberry Shortcake",
        cal: "280 kcal",
        tag: [],
        stock: "10",
        ingredients: ["shortcakes", "strawberries", "whipped cream", "sugar", "vanilla extract"],
        price: "6",
        img: "./assets/desserts-strawberry-shortcake.jpg",
      },
    ],
  },
];

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  // to grab from db later on
  const [basketItems, setBasketItems] = useState([
    { item: "Avocado on Toast", qty: "2" },
    { item: "Full Breakfast", qty: "3" },
  ]);
  const [basketQty, setBasketQty] = useState(0);

  const calculateTotalQuantity = () => {
    const totalQty = basketItems.reduce((total, item) => total + parseInt(item.qty), 0);
    setBasketQty(totalQty);
  };

  useEffect(() => {
    calculateTotalQuantity();
  }, [user, basketItems]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/auth" element={<Auth />} />
        <Route path="/menu" element={<Menu menuitems={menuitems} />}>
          {menuitems.map((category, index) => (
            <Route key={index} path={category.name} element={<MenuItem item={category} />}>
              {category.items.map((item, itemIndex) => (
                <Route key={itemIndex} path={item.name} element={<MenuItemDetails item={item} basketItems={basketItems} setBasketItems={setBasketItems} />} />
              ))}
            </Route>
          ))}
        </Route>

        <Route path="/Receipts" element={<Receipts />} />
        <Route path="/Basket" element={<Basket menuitems={menuitems} basketItems={basketItems} setBasketItems={setBasketItems} />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Signout" element={<Signout />} />

        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  );
};

export default App;
