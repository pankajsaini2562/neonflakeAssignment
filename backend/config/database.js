import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const databaseConnection = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("Database is connected succesfully");
    })
    .catch((error) => {
      console.log(error);
    });
};
export default databaseConnection;
