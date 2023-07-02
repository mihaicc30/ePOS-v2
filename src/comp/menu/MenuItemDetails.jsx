import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLeft } from "react-icons/ai";

const MenuItemDetails = ({ item, basketItems, setBasketItems }) => {
	const navigate = useNavigate();
	const [quantity, setQuantity] = useState(0);

	const decreaseQuantity = () => {
		if (quantity > 0) {
			setQuantity(quantity - 1);
		}
	};

	const increaseQuantity = () => {
		setQuantity(quantity + 1);
	};

	const addToBasket = () => {
		const existingItem = basketItems.find((basketItem) => basketItem.item === item.name);
		if (existingItem) {
		  const updatedBasket = basketItems.map((basketItem) => {
			if (basketItem.item === item.name) {
			  return {
				...basketItem,
				qty: String(parseInt(basketItem.qty) + quantity),
			  };
			}
			return basketItem;
		  });
		  setBasketItems(updatedBasket);
		} else {
		  const updatedBasket = [
			...basketItems,
			{ item: item.name, qty: String(quantity) },
		  ];
		  setBasketItems(updatedBasket);
		}
		navigate(-1);
	  };

	  
	return (
		<div className="fixed inset-0 z-20 bg-[--c60] flex flex-col overflow-auto">
			<button className="mr-auto p-2 text-3xl" onClick={() => navigate(-1)}>
				<AiOutlineLeft />
			</button>

			<div className="p-4 flex flex-col">
				<p className="text-xl font-bold mb-2">{item.name}</p>
				<p className="text-sm mb-2 capitalize">
					{item.ingredients.map((itemz, index) => (
						<span key={index}>
							<span>{itemz}</span>
							{index !== item.ingredients.length - 1 && <span>, </span>}
						</span>
					))}
				</p>

				<div className="border-2 p-4 flex flex-wrap gap-4 justify-center capitalize">
					<span>{item.cal}</span>
					{item.tag &&
						item.tag.length > 0 &&
						item.tag.map((item, index) => <span key={index}>{item}</span>)}
				</div>

				<button className="bg-[--c1] rounded mt-4 px-3 py-1 font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
					allergen info
				</button>
			</div>
			<span className="grow"></span>

			<p className="text-center text-3xl font-bold">
				£{parseFloat(item.price).toFixed(2)}
			</p>
			<div className="flex gap-4 justify-center text-3xl items-center">
				<button
					className="px-4 py-2 rounded-full border-2"
					onClick={decreaseQuantity}>
					-
				</button>
				<span>{quantity}</span>
				<button
					className="px-4 py-2 rounded-full border-2"
					onClick={increaseQuantity}>
					+
				</button>
			</div>

			<button
			disabled={quantity < 1 ? true : false}
				onClick={addToBasket}
				className="bg-[--c1] rounded mx-6 my-4 px-3 py-1 font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
				ADD TO BASKET
			</button>
		</div>
	);
};

export default MenuItemDetails;
