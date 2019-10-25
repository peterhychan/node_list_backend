const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    .catch(err => console.log(err));
  console.log("MONGODB Connected:".blue.bold + conn.connection.host.underline);
};

module.exports = connectDB;
