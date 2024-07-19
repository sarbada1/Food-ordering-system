import { useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import StoreProvider, { StoreContext } from "./context/StoreContext";
import { useLocation } from "react-router-dom";
import Toast from "./components/Toast/Toast";
import axios from "axios";

const App = () => {
  const { token } = useContext(StoreContext);
  const [showLogin, setShowLogin] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const extractedParams = {
      status: params.get("status"),
      t: params.get("t"),
      idx: params.get("idx"),
      token: params.get("token"),
      bank_reference: params.get("bank_reference"),
      amount: params.get("amount"),
      mobile: params.get("mobile"),
      transaction_id: params.get("transaction_id"),
      tidx: params.get("tidx"),
      total_amount: params.get("total_amount"),
      purchase_order_id: params.get("purchase_order_id"),
      purchase_order_name: params.get("purchase_order_name"),
      pidx: params.get("pidx"),
    };

    const verifyPayment = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/order/khalti-verify",
          {
            pidx: extractedParams.pidx,
            productIdentity: extractedParams.purchase_order_id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setToastMessage("Transaction Completed Successfully");
        } else {
          setToastMessage("Payment verification failed");
        }
      } catch (error) {
        console.error("Error verifying payment", error);
        setToastMessage("Error verifying payment");
      }
    };

    if (extractedParams.status === "Completed") {
      verifyPayment();
    }
  }, [location, token]);

  const closeToast = () => {
    setToastMessage("");
  };
  return (
    <StoreProvider>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
        </Routes>
        {toastMessage && <Toast message={toastMessage} onClose={closeToast} />}
      </div>
      <Footer />
    </StoreProvider>
  );
};

export default App;
