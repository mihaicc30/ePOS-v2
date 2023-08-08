import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AiOutlineLeft, AiOutlineMinusCircle } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";

const Allergens = ({ data, modal, setModal }) => {
  useEffect(() => {}, [data]);

  const notContains = <BsCheck2Circle className="fill-green-400 text-3xl" />;
  const contains = <AiOutlineMinusCircle className="fill-red-400 text-3xl" />;
  return (
    <>
      {createPortal(
        <div className="modalBG fixed right-0 left-0 bg-black/50 top-0 bottom-0 z-40 text-center flex flex-col items-center" onClick={(e) => (String(e.target?.className).startsWith("modalBG") ? setModal(!modal) : null)}>
          <div className="fixed right-0 left-[35%] bg-white top-0 bottom-0 z-40 text-center flex flex-col items-center">
            <img src={"../." + data.img} className="h-[100px] w-fit mx-auto" style={{ objectFit: "cover", overflow: "hidden" }} />
            <span className="py-2 ml-2" onClick={() => setModal(!modal)}>
              <AiOutlineLeft className="mr-auto text-3xl cursor-pointer" />
            </span>
            <div className="animate-fadeUP1">
              <p className="text-center">£{data.price.toFixed(2)}</p>
              <p className="text-center text-2xl font-bold">{data.name}</p>
              <p className="text-center text-xl border-b-4 pb-4 mb-4">{data.calories} kcal</p>

              <p className="text-xl text-center pb-4 mb-4">Ingredients</p>
              <div className="flex flex-wrap justify-center gap-2 border-b-4 pb-4 mb-4">
                {data.ingredients.map((item, index) => (
                  <span key={index}>
                    {item}
                    {index !== data.ingredients.length - 1 && ","}
                  </span>
                ))}
              </div>
              <p className="text-xl text-center pb-4 mb-4">Allergens</p>
              <div className="grid grid-cols-2 justify-items-center mx-auto max-w-[400px]">
                <div className="grid grid-cols-1 justify-items-start max-w-[200px] mx-auto whitespace-nowrap">
                  <p className="capitalize inline-flex">{data.allergensList.Nuts ? notContains : contains}Nuts</p>
                  <p className="capitalize inline-flex">{data.allergensList.Gluten ? notContains : contains}Gluten</p>
                  <p className="capitalize inline-flex">{data.allergensList.Milk ? notContains : contains}Milk</p>
                  <p className="capitalize inline-flex">{data.allergensList.Egg ? notContains : contains}Egg</p>
                  <p className="capitalize inline-flex">{data.allergensList.Mustard ? notContains : contains}Mustard</p>
                  <p className="capitalize inline-flex">{data.allergensList.Crustaceans ? notContains : contains}Crustaceans</p>
                  <p className="capitalize inline-flex">{data.allergensList.Fish ? notContains : contains}Fish</p>
                </div>
                <div className="grid grid-cols-1 justify-items-end max-w-[200px] mx-auto whitespace-nowrap">
                  <p className="capitalize inline-flex">Lupin{data.allergensList.Lupin ? notContains : contains}</p>
                  <p className="capitalize inline-flex">Moluscs{data.allergensList.Moluscs ? notContains : contains}</p>
                  <p className="capitalize inline-flex">Peanuts{data.allergensList.Peanuts ? notContains : contains}</p>
                  <p className="capitalize inline-flex">Sesame Seeds{data.allergensList.SesameSeeds ? notContains : contains}</p>
                  <p className="capitalize inline-flex">Soybeans{data.allergensList.Soybeans ? notContains : contains}</p>
                  <p className="capitalize inline-flex">Sulphur{data.allergensList.Sulphur ? notContains : contains}</p>
                  <p className="capitalize inline-flex">Celery{data.allergensList.Celery ? notContains : contains}</p>
                </div>
              </div>
              <p className="text-xl text-center pb-4 mb-4 border-t-4 pt-4 mt-4">Suitability</p>
              <div className="border-b-4 pb-4 mb-4 flex justify-evenly">
                <p className="inline-flex gap-4 text-xl">Vegetarians {data.allergensList.Meat ? <AiOutlineMinusCircle className="fill-red-400 text-3xl" /> : <BsCheck2Circle className="fill-green-400 text-3xl" />}</p>
                <p className="inline-flex gap-4 text-xl">Vegans {data.allergensList.Meat || data.allergensList.Milk || data.allergensList.Egg || data.allergensList.Fish || data.allergensList.Crustaceans ? <AiOutlineMinusCircle className="fill-red-400 text-3xl" /> : <BsCheck2Circle className="fill-green-400 text-3xl" />}</p>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Allergens;
