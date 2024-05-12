import React from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
const Add = () => {
  return (
    <div className='add'>
      <form className='flex-col'>
        <div className="add-image-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={assets.upload_area} alt="" />
          </label>
          <input type="text" id="image" hidden required />
        </div>
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input type="text" name="name" placeholder='Type here' />
        </div>

        <div className="add-product-description flex-col">
          <p>Product description</p>
          <input type="text" name="description" row="6" placeholder='Write content here' />
        </div>
        <div className="add-product-description ">
          <div className="add-category flex-col">

            <p>Product description</p>
            <select name="category" >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Desert">Desert</option>
              <option value="Sandwitch">Sandwitch</option>
              <option value="Cake">Cake</option>
              <option value="Pure veg">Pure veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>

          <div className="add-price flex-ol">
            <p>Product price</p>
            <input type="number" name="price" placeholder='$20' />
          </div>
        </div>
        <button type='submit' className='add-btn'>Add</button>
      </form>
    </div>
  )
}

export default Add