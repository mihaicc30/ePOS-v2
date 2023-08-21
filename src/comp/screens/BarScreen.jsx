import React, { useEffect, useState, useRef, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOrders, fetchZapped, zapOrder, recallOrder, fetchAllOrders } from "../../utils/DataTools";
import { HiMenuAlt2, HiOutlineLogout } from "react-icons/hi";

const BarScreen = () => {
  const navigate = useNavigate();
  const [onNow, setOnNow] = useState(1);
  const [orders, setOrders] = useState([]);
  const [queryDate, setQueryDate] = useState(`${new Date().toLocaleDateString("en-GB").split("/")[2]}-${new Date().toLocaleDateString("en-GB").split("/")[1]}-${new Date().toLocaleDateString("en-GB").split("/")[0]}`);
  const waitingTimeRef = useRef(null);

  const fetchData = async () => {
    let data = {
      venueID: localStorage.getItem("venueID"),
      orderType: "bar",
      dateString: queryDate.split("-")[2] + "/" + queryDate.split("-")[1] + "/" + queryDate.split("-")[0],
    };
    switch (onNow) {
      case 1:
        setOrders(await fetchOrders(data));
        break;
      case 2:
        setOrders(await fetchZapped(data));
        break;
      case 3:
        setOrders(await fetchAllOrders(data));
        break;
      default:
        break;
    }
    // Trigger the timeout again after the logic is executed
    waitingTimeRef.current = setTimeout(fetchData,3000);
  };

  useEffect(() => {
    waitingTimeRef.current = setTimeout(fetchData,3000);

    return () => clearTimeout(waitingTimeRef.current);
  }, [onNow]);

  useEffect(() => {
    (async () => {
      let data = {
        venueID: localStorage.getItem("venueID"),
        orderType: "bar",
        dateString: queryDate.split("-")[2] + "/" + queryDate.split("-")[1] + "/" + queryDate.split("-")[0],
      };
      switch (onNow) {
        case 1:
          setOrders(await fetchOrders(data));
          break;
        case 2:
          setOrders(await fetchZapped(data));
          break;
        case 3:
          setOrders(await fetchAllOrders(data));
          break;

        default:
          break;
      }
    })();
  }, [onNow, queryDate]);



  const zapThisOrder = (id) => {
    (async () => {
      let query = await zapOrder(id);

      if (query.message === "ok") {
        let updatedOrders = orders.filter((order) => order._id !== id);
        setOrders(updatedOrders);
      } else {
        console.log(query.message);
      }
    })();
  };

  const recallThisOrder = (id) => {
    (async () => {
      let query = await recallOrder(id);

      if (query.message === "ok") {
        let updatedOrders = orders.filter((order) => order._id !== id);
        setOrders(updatedOrders);
      } else {
        console.log(query.message);
      }
    })();
  };

  return (
    <>
      <div className="flex p-1 bg-blue-300 items-center">
        <button className="text-3xl cursor-pointer">{/* <HiMenuAlt2 /> */}</button>
        <div className="mx-auto">
          <button className={`rounded shadow-md py-2 px-12 ${onNow == 2 ? "font-[600] bg-orange-300" : "bg-orange-200 text-gray-400"} `} onClick={() => setOnNow(2)}>
            Zapped
          </button>
          <button className={`rounded shadow-md py-2 px-12 ${onNow == 1 ? "font-[600] bg-orange-300" : "bg-orange-200 text-gray-400"} `} onClick={() => setOnNow(1)}>
            On Now
          </button>
        </div>
        <span className="mx-1 text-xl font-[600]">{new Date().toLocaleDateString("en-GB")}</span>

        <button className="ml-4 text-3xl cursor-pointer" onClick={() => navigate("/SigOut")}>
          <HiOutlineLogout />
        </button>
      </div>

      <div className="ordersContainer h-[100svh] w-[100svw] bg-gray-100 content-start overflow-y-auto px-4 flex flex-col flex-wrap">
        {orders.length < 1 && (
          <div className="flex justify-center w-[100%]">
            <p className="text-xl font-[600]">No orders.</p>
          </div>
        )}
        {orders.map((order, index) => {
          return (
            <Fragment key={index + "fragOrd"}>
              <div className="flex flex-col w-[250px] border-x-4 border-t-4 px-2 my-1 mx-4" key={index + "ord1"}>
                <span className="animate-colorFlash text-xs text-center">Order Start</span>
                <div className="flex justify-between">
                  <span>{order.dateTime}</span>
                  <span>{order.dateString}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>T-{order.table}</span>
                  <span>#{order.queueNumber}</span>
                </div>
                <span>{order.displayName}</span>
              </div>
              <span className="border-y-2 p-1 w-[250px]  mx-4"></span>
              {order.items.map((it, index2) => {
                if (it.name === "Line") {
                  return <span className="border-y-2 p-1 w-[250px] mx-4" key={index2 + "ord11"}></span>;
                }
                return (
                  <div className="flex flex-col w-[250px] mx-4 " key={index2 + "ord12"}>
                    <span>
                      {it.qty} x {it.name}
                    </span>
                    <i>{it.message}</i>
                  </div>
                );
              })}
              <div className="flex flex-col w-[250px] border-x-4 border-b-4 px-2 mb-4 mx-4" key={index + "ord3"}>
                {order.orderStatus == "todo" ? (
                  <button onClick={() => zapThisOrder(order._id)} className="my-1 rounded-[5px] shadow-[6px_6px_12px_#969696,-6px_-6px_12px_#fff] bg-gradient-to-tl from-[#f0f0f0] to-[#cacaca]">
                    Zap
                  </button>
                ) : (
                  <button onClick={() => recallThisOrder(order._id)} className="my-1 rounded-[5px] shadow-[6px_6px_12px_#969696,-6px_-6px_12px_#fff] bg-gradient-to-tl from-[#f0f0f0] to-[#cacaca]">
                    Recall
                  </button>
                )}

                <span className="text-xs text-center">Order End</span>
              </div>
            </Fragment>
          );
        })}
      </div>
    </>
  );
};

export default BarScreen;

// return (
//     <div className="ordersContainer h-[100svh] w-[100svw] bg-gray-100 content-start gap-4 p-2 flex flex-col flex-wrap">
//       {orders.map((order, index) => {
//         return (
//           <div key={index + "ordz"} className="flex flex-col flex-wrap w-[250px] ">
//             <div className="flex flex-col flex-wrap" key={index + "ord1"}>
//               <span className="border-x-4 border-t-4 text-xs text-center">Order Start</span>
//               <span>{order.dateTime}</span>
//               <div className="flex justify-between p-2 text-lg font-bold">
//                 <span>T-{order.table}</span>
//                 <span>#{order.queueNumber}</span>
//               </div>
//               <span>{order.displayName}</span>
//             </div>
//             <span className="border-y-2 my-1 p-1"></span>
//             {order.items.map((it, index2) => {
//               if (it.name === "Line") {
//                 return <span className="border-y-2 my-1 p-1" key={index2 + "ord11"}></span>;
//               }
//               return (
//                 <div className="flex flex-col" key={index2 + "ord12"}>
//                   <span>
//                     {it.qty} x {it.name}
//                   </span>
//                   <i>{it.message}</i>
//                 </div>
//               );
//             })}
//             <div className="flex flex-col  " key={index + "ord3"}>
//               <button className="my-4 rounded-[5px] shadow-[6px_6px_12px_#969696,-6px_-6px_12px_#fff] bg-gradient-to-tl from-[#f0f0f0] to-[#cacaca]">Zap</button>
//               <span className="border-x-4 border-b-4 text-xs text-center">Order End</span>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
