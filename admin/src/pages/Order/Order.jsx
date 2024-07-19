/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./Order.css";
import axios from "axios";
import Toast from "../../components/Toast/Toast";

const Order = ({ url }) => {
  const [list, setList] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const fetchList = async () => {
    try {
      const res = await axios.get(`${url}/api/order/get`);
      if (res.data.success) {
        setList(res.data.orders);
        console.log(res.data.orders);
      } else {
        showToastMessage("Error fetching orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      showToastMessage("Error fetching orders");
    }
  };

  const removeOrder = async (orderId) => {
    try {
      const response = await axios.delete(`${url}/api/order/${orderId}`);
      if (response.data.success) {
        showToastMessage(response.data.message);
        await fetchList();
      } else {
        showToastMessage("Error deleting order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      showToastMessage("Error deleting order");
    }
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 5000); // Auto-close after 5 seconds
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Orders List</p>
      <div className="list-table">{/* Your table content here */}</div>
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
      <div className="list-table-format title">
        <b>Name</b>
        <b>Items</b>
        <b>Quantity</b>
        <b>Amount</b>
        <b>Address</b>
        <b>Payment Status</b>
        <b>Date</b>
        <b>Action</b>
      </div>
      {list.map((item, index) => {
        return (
          <div key={index} className="list-table-format">
            <p>{item.address.firstName + " " + item.address.lastName}</p>
            <p>
              {item.items.map((food, index) => (
                <span key={food._id}>
                  {food.name}
                  {item.items.length - 1 !== index && ","}{" "}
                </span>
              ))}
            </p>
            <p>
              {item.items.map((food, index) => (
                <span key={food._id}>
                  {food.quantity}
                  {item.items.length - 1 !== index && ","}{" "}
                </span>
              ))}
            </p>
            <p>${item.amount}</p>
            <p>
              {item.address.state}, {item.address.street},{" "}
              {item.address.zipcode}
            </p>
            <p>{item.status}</p>
            <p>{item?.date?.split("T")[0]}</p>
            <p onClick={() => removeOrder(item._id)} className="cursor">
              X
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Order;
