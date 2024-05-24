import React, { useContext } from 'react';
import './FoddItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image }) => {
    const { cartItems, addToCart, removeFromCart, url, token, setShowLogin } = useContext(StoreContext);

    const handleAddToCart = () => {
        if (!token) {
            setShowLogin(true);
        } else {
            addToCart(id);
        }
    };

    const handleRemoveFromCart = () => {
        if (!token) {
            setShowLogin(true);
        } else {
            removeFromCart(id);
        }
    };

    if (!cartItems) {
        console.error('cartItems is not defined or not an object.');
        return <div>Loading...</div>;
    }
    if (!addToCart || !removeFromCart || !url) {
        console.error('StoreContext is missing required functions or url.');
        return <div>Error: Missing store context data.</div>;
    }
    if (!assets || !assets.add_icon_white || !assets.remove_icon_red || !assets.add_icon_green || !assets.rating_starts) {
        console.error('assets object is missing necessary properties.');
        return <div>Error: Missing assets.</div>;
    }

    return (
        <div className='food-item'>
            <div className="food-item-img-container">
                <img src={`${url}/images/${image}`} alt="" className="food-item-image" />
                {!cartItems[id] ? (
                    <img className='add' onClick={handleAddToCart} src={assets.add_icon_white} alt='' />
                ) : (
                    <div className='food-item-counter'>
                        <img onClick={handleRemoveFromCart} src={assets.remove_icon_red} alt="" />
                        <p>{cartItems[id]}</p>
                        <img onClick={handleAddToCart} src={assets.add_icon_green} alt="" />
                    </div>
                )}
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="Rating stars" />
                </div>
                <p className="food-item-desc">{description}</p>
                <p className="food-item-price">${price}</p>
            </div>
        </div>
    );
};

export default FoodItem;
