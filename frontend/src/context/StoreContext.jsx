import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:8080";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [showLogin, setShowLogin] = useState(false); // Add showLogin state

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      try {
        await axios.post(url + "/api/cart/add", { itemId }, { headers: { Authorization: `Bearer ${token}` } });
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      try {
        await axios.post(url + "/api/cart/remove", { itemId }, { headers: { Authorization: `Bearer ${token}` } });
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(url + "/api/cart/get", {}, { headers: { Authorization: `Bearer ${token}` } });
      setCartItems(response.data.cartData);
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };
  

  useEffect(() => {
    async function loaddata() {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token");
      console.log("Stored Token:", storedToken); // Log the token
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      } else {
        console.error("No token found in local storage");
      }
    }
    loaddata();
  }, []);
  

  const contextValue = {
    food_list,
    url,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    showLogin,
    setShowLogin // Add setShowLogin to the context value
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
