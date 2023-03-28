const mongoose = require("mongoose");
const DBURL = 'mongodb+srv://doreenkasivi:chatbot@cluster0.xmdcbcf.mongodb.net/?retryWrites=true&w=majority'
const connectDB = async () => {
  await mongoose
    .connect(DBURL, {
      useNewUrlParser: true,
    })
    .then(
      () => {
        console.log("+++++++ Database connected +++++++");
      }
    )
    .catch((er) => {
      console.log(":::::::: Database Coonection Error ::::::::\nError: "+er);
      process.exit(1);
    });
};
module.exports = connectDB;