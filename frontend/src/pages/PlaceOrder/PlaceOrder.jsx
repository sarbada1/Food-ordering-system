import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import KhaltiCheckout from 'khalti-checkout-web';
import { env } from '../../config/EnvironmentConfig';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const handleKhaltiPayment = async () => {
    // Save the order to your backend
    const orderResponse = await fetch(`${url}/api/order/place-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token
      },
      body: JSON.stringify({
        userId: "user-id", // Replace with actual user ID
        items: cartItems,
        amount: getTotalCartAmount() + 2, // Assuming delivery fee is 2
        address: `${data.street}, ${data.city}, ${data.state}, ${data.zipcode}, ${data.country}`
      })
    });

    const orderData = await orderResponse.json();

    if (orderData.success) {
      const khaltiConfig = {
        publicKey: env.PUBLIC_KEY, 
        productIdentity: orderData.order._id,
        productName: 'Food Order',
        productUrl: `${url}/product/${orderData.order._id}`,
        eventHandler: {
          onSuccess(payload) {
            console.log(payload);
            // Verify payment on backend
            fetch(`${url}/api/khalti-verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload)
            }).then(res => res.json()).then(data => {
              if (data.success) {
                window.location.href = `${url}/verify?success=true&orderId=${orderData.order._id}`;
              } else {
                window.location.href = `${url}/verify?success=false&orderId=${orderData.order._id}`;
              }
            }).catch(error => console.error('Error verifying payment', error));
          },
          onError(error) {
            console.error(error);
          },
          onClose() {
            console.log('Widget is closing');
          }
        },
        paymentPreference: [
          'KHALTI',
          'EBANKING',
          'MOBILE_BANKING',
          'CONNECT_IPS',
          'SCT',
        ],
      };

      let checkout = new KhaltiCheckout(khaltiConfig);
      checkout.show({ amount: (getTotalCartAmount() + 2) * 100 });
    } else {
      console.error('Error placing order', orderData.message);
    }
  };

  return (
    <form className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>

        <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />

        <div className="multi-fields">
          <input name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>

        <div className="multi-fields">
          <input name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip Code' />
          <input name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>

        <input name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</p>
            </div>
          </div>
          <button type="button" onClick={handleKhaltiPayment}>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
