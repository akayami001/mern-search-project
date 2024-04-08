require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/users.js");
const cityRoutes = require("./routes/cities.js");

//express app
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use((req, res, next) => {
  next();
});

//routes
app.use("/api/users", userRoutes);
app.use("/api/cities", cityRoutes);

//connect to db
mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    //listen for requests
    app.listen(process.env.PORT, () => {
      console.log(`connected to db & listening on port`, process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });