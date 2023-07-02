import React, { useEffect, useState } from "react";
import "./Basket.css";

const Basket = ({ menuitems, basketItems, setBasketItems }) => {
	const [computedBasket, setComputedBasket] = useState([]);
	const [totalPrice, setTotalPrice] = useState(0);

	useEffect(() => {
		const matchingItems = menuitems.reduce((items, category) => {
			const matchedItems = category.items
				.filter((item) =>
					basketItems.some((basketItem) => basketItem.item === item.name),
				)
				.map((item) => ({
					...item,
					qty: parseInt(
						basketItems.find((basketItem) => basketItem.item === item.name).qty,
					),
				}));
			return [...items, ...matchedItems];
		}, []);

		setComputedBasket(matchingItems);
	}, []);

	useEffect(() => {
		const totalPrice = calculateTotalPrice(computedBasket);
		setTotalPrice(totalPrice);
	}, [computedBasket]);

	const calculateTotalPrice = (basketItems) => {
		const totalPrice = basketItems.reduce(
			(total, item) => total + parseFloat(item.price * item.qty),
			0,
		);
		return totalPrice.toFixed(2);
	};
	const handleIncrement = (item) => {
		const updatedBasket = computedBasket.map((basketItem) => {
			if (basketItem.name === item.name) {
				const updatedQty = basketItem.qty + 1;
				return {
					...basketItem,
					qty: updatedQty,
				};
			}
			return basketItem;
		});

		const updatedBasketItems = basketItems.map((basketItem) => {
			if (basketItem.item === item.name) {
				const updatedQty = parseInt(basketItem.qty) + 1;
				return {
					...basketItem,
					qty: updatedQty.toString(),
				};
			}
			return basketItem;
		});

		setComputedBasket(updatedBasket);
		setBasketItems(updatedBasketItems);
	};

	const handleDecrement = (item) => {
		const updatedBasket = computedBasket.map((basketItem) => {
			if (basketItem.name === item.name && basketItem.qty > 0) {
				const updatedQty = basketItem.qty - 1;
				return {
					...basketItem,
					qty: updatedQty,
				};
			}
			return basketItem;
		});

		const updatedBasketItems = basketItems.map((basketItem) => {
			if (basketItem.item === item.name && parseInt(basketItem.qty) > 0) {
				const updatedQty = parseInt(basketItem.qty) - 1;
				return {
					...basketItem,
					qty: updatedQty.toString(),
				};
			}
			return basketItem;
		});

		setComputedBasket(updatedBasket);
		setBasketItems(updatedBasketItems);
	};

	return (
		<div className="basis-[80%] bg-[--c60] z-10 overflow-y-scroll flex flex-col">
			<div className="flex flex-col text-center my-4 pb-4 border-b-2 text-xl">
				<p>The White Lion</p>
				<p>Table: 6</p>
			</div>

			<div className="products flex flex-col gap-4 px-4 my-4 grow overflow-auto">
				{computedBasket.map((item) => {
					// console.log(item);
					return (
						<div key={item.name} className="product flex gap-4 pb-4 border-b-2">
							{/* <img src={item.img} alt={item.name} /> */}
							<div className="grow flex flex-col justify-start">
								<p className="font-bold text-xl line-clamp-1">{item.name}</p>
								<span className="text-xs font-normal">{item.cal}</span>
								<div className="flex gap-4 justify-start text-3xl items-center">
									<button
										className="px-3 py-1 rounded-full border-2"
										onClick={() => handleDecrement(item)}>
										-
									</button>
									<span className="quantity">{item.qty}</span>
									<button
										className="px-3 py-1 rounded-full border-2"
										onClick={() => handleIncrement(item)}>
										+
									</button>
								</div>
							</div>

							<div>
								<p className="text-xl text-end ">Total:</p>
								<p className="font-bold text-xl text-end">
									£{(parseFloat(item.price) * parseFloat(item.qty)).toFixed(2)}
								</p>
							</div>
						</div>
					);
				})}
			</div>

			<p className="text-3xl text-center my-4 pt-4 border-t-2">
				TOTAL £{totalPrice}
			</p>
			<button
				disabled={parseFloat(totalPrice) <= 0 ? true : false}
				className="bg-[--c1] rounded px-3 text-center py-3 my-4 mx-4 font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
				Payment
			</button>
		</div>
	);
};

export default Basket;
