import React, { useState, useEffect } from "react";
import { BsFilterRight } from "react-icons/bs";
import { AiOutlineLeft, AiOutlineMinusCircle } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { processAllergenList, getStockColour } from "../../utils/BasketUtils";
import { addNewProduct, updateProduct, deleteProduct } from "../../utils/DataTools";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminProducts = ({ menuitems, setMenuitems }) => {
  // mimic db fetch - temporary
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState(false);

  const [tempProduct, setTempProduct] = useState({
    name: "",
    tag: [],
    category: "",
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
    img: "",
    calories: 0,
    ingredients: [],
  });

  const [searchValue, setSearchValue] = useState("");
  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

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
    setTempProduct(product);
    console.log(product);
  };

  const notContains = <BsCheck2Circle className="fill-green-400 text-3xl" />;
  const contains = <AiOutlineMinusCircle className="fill-red-400 text-3xl" />;

  const handleSave = async () => {
    // Find the index of the item in menuitems with matching _id
    const itemToUpdate = menuitems.find((item) => item?._id === tempProduct._id);
    // If the item is found, update it in menuitems
    if (itemToUpdate) {
      console.log("Updating item.");
      const query = await updateProduct(tempProduct);
      if (query.matchedCount === 1) {
        const updatedMenuitems = menuitems.map((item) => {
          if (item._id === tempProduct._id) {
            return tempProduct;
          } else {
            return item;
          }
        });
        setMenuitems(updatedMenuitems);
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
      }
    } else {
      console.log("Creating new item.");
      const query = await addNewProduct(tempProduct);
      if (query.message === "Product added successfully.") {
        setModal(!modal);
        tempProduct._id = query.pid;
        setTimeout(() => {
          menuitems.push(tempProduct);
        }, 333);
        toast.success(`New item has been added.`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  const handleDelete = async (product) => {
    await deleteProduct(product).then((r) => {
      if (r.message == "Product deleted successfully.") {
        setModal(!modal);
        const updatedMenuItems = menuitems.filter((item) => item._id !== tempProduct._id);
        setMenuitems(updatedMenuItems);
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
      }
    });
  };

  const toggleAllergy = (product) => {
    const updatedAllergensList = {
      ...modalData.allergensList,
      [product]: !modalData.allergensList[product],
    };
    setModalData((prev) => ({
      ...prev,
      allergensList: updatedAllergensList,
    }));
    setTempProduct((prev) => ({
      ...prev,
      allergensList: updatedAllergensList,
    }));
  };

  const handleAdd = () => {
    let newProduct = {
      name: "",
      tag: [],
      category: "",
      subcategory: "",
      subcategory_course: 0,
      stock: 0,
      price: 0,
      portionCost: 0,
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
      calories: 0,
      ingredients: [],
    };

    setModal(!modal);
    setModalData(newProduct);
    setTempProduct(newProduct);
  };

  return (
    <div className="flex flex-col overflow-y-auto relative">
      <div className="absolute">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="light" />
      </div>
      {modal && (
        <div className="modalBG fixed right-0 left-0 bg-black/50 top-0 bottom-0 z-40 text-center flex flex-col items-center" onClick={(e) => (String(e.target?.className).startsWith("modalBG") ? setModal(!modal) : null)}>
          <div className="fixed right-0 left-[25%] bg-white top-0 bottom-0 z-40 text-center flex flex-col items-center">
            <button className="absolute top-0 left-0 p-2 text-lg animate-fadeUP1" onClick={() => setModal(!modal)}>
              ◀ Cancel
            </button>
            {modalData.name && (
              <button className="absolute top-[15%] left-0 p-2 text-lg animate-fadeUP1" onClick={() => handleDelete(modalData)}>
                <span className="text-red-400">◀</span> Delete
              </button>
            )}
            <button className="absolute top-[30%] left-0 p-2 text-lg animate-fadeUP1" onClick={handleSave}>
              <span className="text-green-400">◀</span> Save
            </button>

            <div className="overflow-auto px-2 w-[80%] ml-auto pr-4 relative grid grid-cols-6 gap-2">
              <img src={"../." + modalData.img} className="h-[100px] w-[fit] mx-auto col-span-6" style={{ objectFit: "cover", overflow: "hidden" }} onClick={() => console.log("dev**to create..")} />

              <div className="flex my-3 relative flex-col col-span-4">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Name</span>
                <input
                  onChange={(e) =>
                    setTempProduct((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  type="text"
                  className="p-2 text-lg border-y-2 border-y-black/30 font-bold shadow-lg rounded-xl"
                  defaultValue={modalData.name}
                  placeholder="Product name.."
                />
              </div>

              <div className="flex my-3 relative flex-col col-span-2">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Price</span>
                <input
                  onChange={(e) =>
                    setTempProduct((prev) => ({
                      ...prev,
                      price: parseFloat(e.target.value),
                    }))
                  }
                  type="text"
                  className="p-2 text-lg border-y-2 border-y-black/30 font-bold shadow-lg rounded-xl"
                  defaultValue={modalData.price.toFixed(2)}
                />
              </div>

              <div className="flex my-3 relative flex-col col-span-3">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Base Cost</span>
                <input
                  onChange={(e) =>
                    setTempProduct((prev) => ({
                      ...prev,
                      portionCost: parseFloat(e.target.value),
                    }))
                  }
                  type="text"
                  className="p-2 text-lg border-y-2 border-y-black/30 font-bold shadow-lg rounded-xl"
                  defaultValue={modalData.portionCost.toFixed(2)}
                />
              </div>

              <div className="flex my-3 relative flex-col col-span-3">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">KCal</span>
                <input
                  onChange={(e) =>
                    setTempProduct((prev) => ({
                      ...prev,
                      calories: parseInt(e.target.value),
                    }))
                  }
                  type="text"
                  className="p-2 text-lg border-y-2 border-y-black/30 font-bold shadow-lg rounded-xl"
                  defaultValue={modalData.calories}
                />
              </div>

              <div className="flex my-3 relative flex-col col-span-3">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Stock</span>
                <input
                  onChange={(e) =>
                    setTempProduct((prev) => ({
                      ...prev,
                      stock: parseInt(e.target.value),
                    }))
                  }
                  type="text"
                  className="p-2 text-lg border-y-2 border-y-black/30 font-bold shadow-lg rounded-xl"
                  defaultValue={modalData.stock}
                />
              </div>

              <div className="flex my-3 relative flex-col col-span-3">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Print for</span>
                <select
                  onChange={(e) =>
                    setTempProduct((prev) => ({
                      ...prev,
                      subcategory_course: parseInt(e.target.value),
                    }))
                  }
                  defaultValue={modalData.subcategory_course}
                  className="p-2 text-lg border-y-2 border-y-black/30 font-bold shadow-lg rounded-xl"
                  name="pf"
                  id="pf">
                  <option value="0">Bar</option>
                  <option value="1">Starters</option>
                  <option value="2">Mains</option>
                  <option value="3">Deserts</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 my-4 col-span-6 ">
                <div className="relative ">
                  <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Category</span>
                  <input
                    onChange={(e) => {
                      const category = e.target.value;
                      setTempProduct((prev) => ({ ...prev, category: category }));
                    }}
                    list="cats"
                    type="text"
                    placeholder="Category name.."
                    defaultValue={modalData.category}
                    className="p-2 text-lg border-y-2 border-y-black/30 font-bold shadow-lg rounded-xl w-[100%]"
                  />
                  <datalist id="cats">
                    {[...new Set(menuitems.map((item) => item.category))].map((item, index) => {
                      return (
                        <option key={item + "d"} value={item}>
                          {item}
                        </option>
                      );
                    })}
                  </datalist>
                </div>
                <div className="relative">
                  <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Subcategory</span>
                  <input
                    onChange={(e) => {
                      setTempProduct((prev) => ({
                        ...prev,
                        subcategory: e.target.value,
                      }));
                    }}
                    list="subcats"
                    type="text"
                    placeholder="Subcategory name.."
                    defaultValue={modalData.subcategory}
                    className="p-2 text-lg border-y-2 border-y-black/30 font-bold shadow-lg rounded-xl w-[100%]"
                  />
                  <datalist id="subcats">
                    {[...new Set(menuitems.map((item) => item.subcategory))].map((subcat, index) => (
                      <option key={index + "h"} value={subcat}>
                        {subcat}
                      </option>
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 my-4 col-span-6 relative ">
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Ingredients</span>
                  <textarea
                    onChange={(e) =>
                      setTempProduct((prev) => ({
                        ...prev,
                        ingredients: e.target.value.split(","),
                      }))
                    }
                    placeholder=""
                    className="p-2 border-y-2 border-y-black/40 rounded-xl"
                    name="ingredients"
                    cols="44"
                    rows="4"
                    defaultValue={modalData.ingredients.join(", ")}></textarea>
                </div>

                <div className="flex flex-wrap justify-center gap-2 relative">
                  <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Tags</span>
                  <textarea
                    onChange={(e) =>
                      setTempProduct((prev) => ({
                        ...prev,
                        tag: e.target.value.split(","),
                      }))
                    }
                    placeholder=""
                    className="p-2 border-y-2 border-y-black/40 rounded-xl"
                    name="ingredients"
                    cols="44"
                    rows="4"
                    defaultValue={modalData.tag.join(", ")}></textarea>
                </div>
              </div>

              <div className="grid grid-cols-2 justify-items-center mx-auto my-4 col-span-6 gap-20 relative p-2 border-y-2 border-y-black/40 rounded-xl shadow-lg">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Allergens</span>
                <div className="grid grid-cols-1 justify-items-start max-w-[200px] mx-auto whitespace-nowrap ">
                  <p onClick={(e) => toggleAllergy("Meat")} className="capitalize inline-flex">
                    {modalData.allergensList.Meat ? notContains : contains}Meat
                  </p>
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

              <div className="p-2 border-y-2 border-y-black/30 shadow-lg rounded-xl relative flex col-span-6 justify-center gap-12">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Suitability</span>
                <p className="inline-flex font-bold gap-2 text-lg">Vegetarians {modalData.allergensList.Meat ? <AiOutlineMinusCircle className="fill-red-400 text-3xl" /> : <BsCheck2Circle className="fill-green-400 text-3xl" />}</p>
                <p className="inline-flex font-bold gap-2 text-lg">Vegans {modalData.allergensList.Meat || modalData.allergensList.Moluscs || modalData.allergensList.Milk || modalData.allergensList.Egg || modalData.allergensList.Fish || modalData.allergensList.Crustaceans ? <AiOutlineMinusCircle className="fill-red-400 text-3xl" /> : <BsCheck2Circle className="fill-green-400 text-3xl" />}</p>
              </div>

              <p className="text-lg text-center pb-4 mb-4 pt-4 mt-4 col-span-3">Statistics</p>

              <div className="pb-4 mb-4 flex justify-evenly col-span-6">
                <p>Menu Item Profitability = (Number of Items Sold x Menu Price) – (Number of Items Sold x Item Portion Cost)</p>
                <p>item sold along the year chart</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <p className="text-lg font-bold p-2 underline">Products</p>
      <div className="relative flex  mr-4 items-center max-[350px]:flex-wrap  max-[350px]:justify-center">
        <button onClick={handleAdd} className={`p-2 bg-green-300 rounded-xl shadow-xl border-b-2 border-b-black transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] active:shadow-[inset_0px_4px_2px_black]`}>
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
          className={`p-2 ${menuType2 === "" && searchValue === "" && menuType3 === "" && menuType4 === "" ? "bg-gray-200 text-gray-400" : "bg-[--c1]"} rounded-xl shadow-xl border-b-2 border-b-black transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] active:shadow-[inset_0px_4px_2px_black]`}>
          Clear Filters
        </button>
      </div>

      <div className="flex flex-col overflow-y-auto w-[100%]">
        <>
          {/* categories */}
          <div className={`${searchValue !== "" ? "hidden" : "grid"} `} style={{ gridTemplateColumns: `repeat(${[...new Set(menuitems.map((item) => item.category).filter((category) => category !== undefined))].length}, 1fr)` }}>
            {[...new Set(menuitems.map((item) => item.category))].map((item) => {
              if (item)
                return (
                  <div key={crypto.randomUUID()} onClick={changeMenuType} className={`${menuType === item ? "shadow-[inset_0px_4px_2px_black] bg-[--c12]" : "bg-[--c1]"} border-b-2 border-b-black m-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold `}>
                    {item}
                  </div>
                );
            })}
          </div>

          {/* subcategories */}
          <div className={`transition grid  ${searchValue !== "" ? "hidden" : "grid"}`} style={{ gridTemplateColumns: `repeat(${[...new Set(menuitems.filter((item) => item.category === menuType).map((item) => item.subcategory))].length}, 1fr)` }}>
            {[...new Set(menuitems.filter((item) => item.category === menuType).map((item) => item.subcategory))].map((item) => {
              return (
                <div key={crypto.randomUUID()} onClick={changeMenuType2} className={` ${menuType2 === item ? "shadow-[inset_0px_4px_2px_black] bg-[--c12]" : " bg-[--c1]"} border-b-2 border-b-black m-1 px-1 py-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold`}>
                  {item}
                </div>
              );
            })}
          </div>

          {/* subcategories items */}
          <div className="flex flex-row flex-wrap overflow-y-scroll gap-2 pb-4">
            {menuitems.map((item, index) => {
              if (searchValue !== "") {
                if (item.name.toLowerCase().includes(searchValue.toLowerCase()))
                  return (
                    <div key={`${item.name}-f`} onClick={() => handleEdit(item)} className=" rounded h-[128px] w-[170px] p-2 flex flex-col shadow-lg transition duration-100 cursor-pointer hover:scale-[0.98] active:scale-[0.96] active:shadow-[inset_0px_2px_2px_black]">
                      <span className={`ml-auto px-2 rounded-bl-lg rounded-tr-lg text-end ${getStockColour(item.stock)}`}>{item.stock}</span>
                      <span className="line-clamp-2 h-[48px] font-bold">{item.name}</span>
                      <span>£{item.price}</span>
                      <span className="h-[24px]">{item.allergens}</span>
                    </div>
                  );
              } else {
                if (menuType !== item.category) return;
                if (menuType2 !== item.subcategory && menuType2 !== "") return;
                return (
                  <div key={`${item.name}-g`} onClick={() => handleEdit(item)} className={`flex-[19.2%] max-w-[19.2%] max-lg:flex-[32%] max-lg:max-w-[32%] max-md:flex-[47%] max-md:max-w-[47%] max-sm:flex-[98%] max-sm:max-w-[98%] rounded h-[150px] p-2 w-[170px] flex flex-col shadow-lg transition duration-100 cursor-pointer ${item.stock >= 1 ? "hover:scale-[0.98] active:scale-[0.96] active:shadow-[inset_0px_2px_2px_black]" : "text-gray-300"}`}>
                    <div className="flex justify-between">
                      <span>£{item.price}</span>

                      <span className={`ml-auto px-2 rounded-bl-lg rounded-tr-lg text-end ${getStockColour(item.stock)}`}>{item.stock}</span>
                    </div>
                    <span className="line-clamp-2 h-[48px] font-bold">{item.name}</span>
                  </div>
                );
              }
            })}
          </div>
        </>
      </div>
    </div>
  );
};

export default AdminProducts;
