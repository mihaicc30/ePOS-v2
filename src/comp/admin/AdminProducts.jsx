import React, { useState, useEffect } from "react";
import { BsFilterRight } from "react-icons/bs";
import { AiOutlineLeft, AiOutlineMinusCircle } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { processAllergenList, getStockColour } from "../../utils/BasketUtils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminProducts = ({ menuitems }) => {
  // mimic db fetch - temporary
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {}, [searchValue]);

  const [menuType, setMenuType] = useState("Beverages");
  const [menuType2, setMenuType2] = useState("");
  const [menuType3, setMenuType3] = useState("");
  const [menuType4, setMenuType4] = useState("");

  // filter for beverages/food/barsnacks
  const changeMenuType = (e) => {
    setMenuType2("");
    setMenuType3("");
    setMenuType(e.target.innerText);
  };

  // filter for type of beverage
  const changeMenuType2 = (e) => {
    if (e.target.innerText === menuType2) {
      setMenuType2("");
      setMenuType3("");
    } else {
      setMenuType2(e.target.innerText);
    }
  };

  // filter for type of food
  const changeMenuType3 = (e) => {
    if (e.target.innerText === menuType3) {
      setMenuType3("");
    } else {
      setMenuType3(e.target.innerText);
    }
  };

  // filter for type of bar snack
  const changeMenuType4 = (e) => {
    if (e.target.innerText === menuType3) {
      setMenuType3("");
    } else {
      setMenuType3(e.target.innerText);
    }
  };

  const handleEdit = (product) => {
    setModal(!modal);
    setModalData(product);
  };

  const notContains = <BsCheck2Circle className="fill-green-400 text-3xl" />;
  const contains = <AiOutlineMinusCircle className="fill-red-400 text-3xl" />;

  const handleSave = () => {
    console.log("dev**update item in db using id from modalData");
    console.log("dev**also will show correct message depending if item has an ID or not :)");
    setModal(!modal);

    toast.success(`Item has been saved.`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  };

  const handleDelete = () => {
    console.log("dev**update item in db using id from modalData");
    setModal(!modal);

    toast.info(`Item has been deleted.`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  };

  const toggleAllergy = (product) => {
    const updatedAllergensList = {
      ...modalData.allergensList,
      [product]: !modalData.allergensList[product],
    };
    console.log(updatedAllergensList[product]);
    setModalData((prev) => ({
      ...prev,
      allergensList: updatedAllergensList,
    }));
  };

  const handleAdd = () => {
    let newProduct = {
      name: "",
      tag: [],
      subcategory: "",
      subcategory_course: 0,
      stock: 0,
      price: 0,
      priceOffer: null,
      allergensList: {
        Meat: false,
        Celery: false,
        Crustaceans: false,
        Fish: false,
        Milk: false,
        Mustard: false,
        Peanuts: false,
        Soybeans: false,
        Gluten: false,
        Egg: false,
        Lupin: false,
        Moluscs: false,
        Nuts: false,
        SesameSeeds: false,
        Sulphur: false,
      },
      img: "./assets/defaultDrink.jpg",
      calories: "0",
      ingredients: [],
    };

    setModal(!modal);
    setModalData(newProduct);
  };

  return (
    <div className="flex flex-col overflow-y-auto relative">
      <div className="absolute">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="light" />
      </div>
      {modal && (
        <div className="modalBG fixed right-0 left-0 bg-black/50 top-0 bottom-0 z-40 text-center flex flex-col items-center" onClick={(e) => (String(e.target?.className).startsWith("modalBG") ? setModal(!modal) : null)}>
          <div className="fixed right-0 left-[35%] bg-white top-0 bottom-0 z-40 text-center flex flex-col items-center">
            <button className="absolute top-0 left-0 p-4 text-xl animate-fadeUP1" onClick={() => setModal(!modal)}>
              ◀ Cancel
            </button>
            <button className="absolute bottom-0 left-0 p-4 text-xl animate-fadeUP1 border-y-red-400 border-y-2" onClick={() => console.log("dev**will remove button when item is fetch from the databse and will have an id i can check with to hide the button :)")}>
              ◀ Delete
            </button>
            <button className="absolute top-0 right-0 p-4 text-xl animate-fadeUP1 border-y-green-400 border-y-2" onClick={handleSave}>
              Save ▶
            </button>
            <img src={"../." + modalData.img} className="h-[100px] w-[100%]" style={{ objectFit: "cover", overflow: "hidden" }} onClick={() => console.log("dev**to create..")} />

            <div className="overflow-auto px-2 w-[70%]">
              <div className="flex pr-4">
                £<input className="ml-auto text-end pr-4 text-xl" type="number" defaultValue={modalData.price.toFixed(2)} />
              </div>

              <div className="flex pr-4">
                Name:
                <input type="text" className="ml-auto text-end pr-4 text-2xl font-bold" defaultValue={modalData.name} />
              </div>

              <div className="flex pr-4">
                kcal:
                <input type="text" className="ml-auto text-end pr-4 text-2xl font-bold" defaultValue={modalData.calories} />
              </div>

              <div className="flex pr-4">
                stock:
                <input type="number" className="ml-auto text-end pr-4 text-2xl font-bold" defaultValue={modalData.stock} />
              </div>

              <div className="grid grid-cols-2 gap-4 my-8">
                <div>
                  <p>Category</p>
                  <input list="cats" type="text" placeholder="Category name.." className="p-2 col-span-2 border-b-2 border-b-black rounded-xl mx-1 my-1" />
                  <datalist id="cats">
                    {menuitems.map((item) => (
                      <option key={item.category + "c"} value={item.category}>
                        {item.category}
                      </option>
                    ))}
                  </datalist>
                </div>
                <div>
                  <p>Subcategory</p>
                  <input list="subcats" type="text" placeholder="Subcategory name.." className="p-2 col-span-2 border-b-2 border-b-black rounded-xl mx-1 my-1" />
                  <datalist id="subcats">
                    {menuitems.map((item) => {
                      const subcategories = [...new Set(item.items.map((item2) => item2.subcategory))];

                      return subcategories.map((subcat, index) => (
                        <option key={index + "c"} value={subcat}>
                          {subcat}
                        </option>
                      ));
                    })}
                  </datalist>
                </div>
              </div>

              <p className="text-xl text-center pb-4 mb-4">Ingredients</p>
              <div className="flex flex-wrap justify-center gap-2 border-b-4 pb-4 mb-4">
                <textarea className="border-2 p-2" name="ingredients" cols="44" rows="4" defaultValue={modalData.ingredients.join(", ")}></textarea>
              </div>

              <p className="text-xl text-center pb-4 mb-4">Tags</p>
              <div className="flex flex-wrap justify-center gap-2 border-b-4 pb-4 mb-4">
                <textarea className="border-2 p-2" name="ingredients" cols="44" rows="4" defaultValue={modalData.tag.join(", ")}></textarea>
              </div>

              <p className="text-xl text-center pb-4 mb-4">Allergens</p>
              <div className="grid grid-cols-2 justify-items-center mx-auto max-w-[400px]">
                <div className="grid grid-cols-1 justify-items-start max-w-[200px] mx-auto whitespace-nowrap">
                  <p onClick={(e) => toggleAllergy("Nuts")} className="capitalize inline-flex">
                    {modalData.allergensList.Nuts ? notContains : contains}Nuts
                  </p>
                  <p onClick={(e) => toggleAllergy("Gluten")} className="capitalize inline-flex">
                    {modalData.allergensList.Gluten ? notContains : contains}Gluten
                  </p>
                  <p onClick={(e) => toggleAllergy("Milk")} className="capitalize inline-flex">
                    {modalData.allergensList.Milk ? notContains : contains}Milk
                  </p>
                  <p onClick={(e) => toggleAllergy("Egg")} className="capitalize inline-flex">
                    {modalData.allergensList.Egg ? notContains : contains}Egg
                  </p>
                  <p onClick={(e) => toggleAllergy("Mustard")} className="capitalize inline-flex">
                    {modalData.allergensList.Mustard ? notContains : contains}Mustard
                  </p>
                  <p onClick={(e) => toggleAllergy("Crustaceans")} className="capitalize inline-flex">
                    {modalData.allergensList.Crustaceans ? notContains : contains}Crustaceans
                  </p>
                  <p onClick={(e) => toggleAllergy("Fish")} className="capitalize inline-flex">
                    {modalData.allergensList.Fish ? notContains : contains}Fish
                  </p>
                </div>
                <div className="grid grid-cols-1 justify-items-end max-w-[200px] mx-auto whitespace-nowrap">
                  <p onClick={(e) => toggleAllergy("Lupin")} className="capitalize inline-flex">
                    Lupin{modalData.allergensList.Lupin ? notContains : contains}
                  </p>
                  <p onClick={(e) => toggleAllergy("Moluscs")} className="capitalize inline-flex">
                    Moluscs{modalData.allergensList.Moluscs ? notContains : contains}
                  </p>
                  <p onClick={(e) => toggleAllergy("Peanuts")} className="capitalize inline-flex">
                    Peanuts{modalData.allergensList.Peanuts ? notContains : contains}
                  </p>
                  <p onClick={(e) => toggleAllergy("SesameSeeds")} className="capitalize inline-flex">
                    Sesame Seeds{modalData.allergensList.SesameSeeds ? notContains : contains}
                  </p>
                  <p onClick={(e) => toggleAllergy("Soybeans")} className="capitalize inline-flex">
                    Soybeans{modalData.allergensList.Soybeans ? notContains : contains}
                  </p>
                  <p onClick={(e) => toggleAllergy("Sulphur")} className="capitalize inline-flex">
                    Sulphur{modalData.allergensList.Sulphur ? notContains : contains}
                  </p>
                  <p onClick={(e) => toggleAllergy("Celery")} className="capitalize inline-flex">
                    Celery{modalData.allergensList.Celery ? notContains : contains}
                  </p>
                </div>
              </div>
              <p className="text-xl text-center pb-4 mb-4 border-t-4 pt-4 mt-4">Suitability</p>
              <div className="border-b-4 pb-4 mb-4 flex justify-evenly">
                <p className="inline-flex gap-4 text-xl">Vegetarians {modalData.allergensList.Meat ? <AiOutlineMinusCircle className="fill-red-400 text-3xl" /> : <BsCheck2Circle className="fill-green-400 text-3xl" />}</p>
                <p className="inline-flex gap-4 text-xl">Vegans {modalData.allergensList.Meat || modalData.allergensList.Milk || modalData.allergensList.Egg || modalData.allergensList.Fish || modalData.allergensList.Crustaceans ? <AiOutlineMinusCircle className="fill-red-400 text-3xl" /> : <BsCheck2Circle className="fill-green-400 text-3xl" />}</p>
              </div>

              <p className="text-xl text-center pb-4 mb-4 border-t-4 pt-4 mt-4">Statistics</p>

              <div className="border-b-4 pb-4 mb-4 flex justify-evenly">
                <p>Menu Item Profitability = (Number of Items Sold x Menu Price) – (Number of Items Sold x Item Portion Cost)</p>
                <p>item sold along the year chart</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <p className="text-xl font-bold p-2 underline">Products</p>
      <div className="relative flex  mr-4 items-center max-[350px]:flex-wrap  max-[350px]:justify-center">
        <button onClick={handleAdd} className={`p-2 bg-green-400 rounded-xl shadow-xl border-b-2 border-b-black transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] active:shadow-[inset_0px_4px_2px_black]`}>
          Add New
        </button>
        <div className="relative grow mx-4">
          <input type="text" placeholder="Search..." className="w-[100%] mx-auto pl-10 pr-10 py-2 my-2 rounded" value={searchValue} onChange={handleInputChange} />
          <span className="absolute top-[28px] left-2 -translate-y-3">🔍</span>
          <button
            onClick={() => setSearchValue("")}
            className={`absolute top-[28px] right-5 -translate-y-3 ${searchValue ? "" : "hidden"}
									`}>
            ✖
          </button>
        </div>
        <button
          disabled={menuType2 === "" && menuType3 === "" && menuType4 === "" && searchValue === ""}
          onClick={() => {
            setSearchValue("");
            setMenuType2("");
            setMenuType3("");
            setMenuType4("");
          }}
          className={`p-2 ${menuType2 === "" && searchValue === "" && menuType3 === "" && menuType4 === "" ? "bg-[--c3]" : "bg-[--c1]"} rounded-xl shadow-xl border-b-2 border-b-black transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] active:shadow-[inset_0px_4px_2px_black]`}>
          Clear Filters
        </button>
      </div>

      <div className="flex flex-col overflow-y-auto w-[100%]">
        <>
          {/* categories */}
          <div className={`${searchValue !== "" ? "hidden" : "grid"} `} style={{ gridTemplateColumns: `repeat(${[...new Set(menuitems.map((item) => item.category))].length}, 1fr)` }}>
            {menuitems.map((item) => {
              return (
                <div key={crypto.randomUUID()} onClick={changeMenuType} className={`${menuType === item.category ? "shadow-[inset_0px_4px_2px_black] bg-[--c12]" : "bg-[--c1]"} border-b-2 border-b-black m-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold `}>
                  {item.category}
                </div>
              );
            })}
          </div>

          {/* subcategories */}
          {menuitems.map((item) => {
            const subcategories = [...new Set(item.items.map((item2) => item2.subcategory))];
            return (
              <div key={crypto.randomUUID()} className={`${item.category} transition ${menuType === item.category ? "" : "hidden"} ${searchValue !== "" ? "hidden" : "grid"}`} style={{ gridTemplateColumns: `repeat(${subcategories.length}, 1fr)` }}>
                {subcategories.map((subcat) => (
                  <div key={crypto.randomUUID()} onClick={changeMenuType2} className={`${menuType2 === subcat ? "shadow-[inset_0px_4px_2px_black] bg-[--c12]" : " bg-[--c1]"} border-b-2 border-b-black m-1 px-1 py-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold`}>
                    {subcat}
                  </div>
                ))}
              </div>
            );
          })}

          {/* subcategories items */}
          <div className="flex flex-wrap w-[100%] gap-2 p-2 overflow-y-scroll ">
            {menuitems.flatMap((item) => {
              if (searchValue !== "") {
                return item.items.map((product, index) => {
                  if (product.name.toLowerCase().includes(searchValue.toLowerCase()))
                    return (
                      <div key={`${product.name}-${index}`} onClick={() => handleEdit(product)} className="rounded h-[128px] w-[170px] p-2 flex flex-col shadow-xl transition duration-100 cursor-pointer hover:scale-[0.98] active:scale-[0.96] active:shadow-[inset_0px_2px_2px_black]">
                        <span className={`ml-auto px-2 rounded-bl-lg rounded-tr-lg text-end ${getStockColour(product.stock)}`}>{product.stock}</span>
                        <span className="line-clamp-2 h-[48px] font-bold">{product.name}</span>
                        <span>£{product.price}</span>
                        <span className="h-[24px]">{product.allergens}</span>
                      </div>
                    );
                });
              } else {
                if (menuType !== item.category) return;
                return item.items.map((product, index) => {
                  if (menuType2 !== product.subcategory && menuType2 !== "") return;
                  return (
                    <div key={`${item.name}-${product.name}-${index}`} onClick={() => handleEdit(product)} className={`rounded h-[auto] p-2 w-[170px] flex flex-col shadow-xl transition duration-100 cursor-pointer ${product.stock >= 1 ? "" : "text-gray-300"}`}>
                      <div className="flex justify-between">
                        <span>£{product.price}</span>

                        <span className={`ml-auto px-2 rounded-bl-lg rounded-tr-lg text-end ${getStockColour(product.stock)}`}>{product.stock}</span>
                      </div>
                      <span className="line-clamp-2 h-[48px] font-bold">{product.name}</span>
                      <span className="mt-auto h-[24px]">{processAllergenList(product.allergensList)}</span>
                    </div>
                  );
                });
              }
            })}
          </div>
        </>
      </div>
    </div>
  );
};

export default AdminProducts;
