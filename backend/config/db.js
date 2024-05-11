import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://sanjelsarbada12:DAvjs0mD6NOilxcY@sarbada.owvqywb.mongodb.net/food-del').then(() => {
        console.log("DB connected");
    })
}