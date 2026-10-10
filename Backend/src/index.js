const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
app.use(express.json());
app.use(cors());
const Transcationlist = require("./models/list");
const CategoryList = require("./models/categoryList");

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

async function startServer() {
  if (!mongoUri) {
    console.error("Missing MONGO_URI. Set it in Backend/.env or the process environment.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

startServer();


app.get("/", (req, res) => {
  res.send("HELLO WORLD");
});
app.post("/getTranscationList", (req, res) => {
  Transcationlist.find({}).then((list) => {
    if (list) {
      res.send(list);
    } else {
      res.send("no");
    }
  });
});
app.post("/createTranscationList", (req, res) => {
  console.log(req.body);
  const { name, desc, amount, type } = req.body;
  if (!amount) {
  }
  Transcationlist.create({ name, desc, amount, type }).then((list) => {
    res.json(list);
  });
});
app.put("/updateTranscationList", (req, res) => {
  const { name, amount, desc, type, id } = req.body;
  Transcationlist.updateOne(
    { _id: new mongoose.Types.ObjectId(id) },
    { name, amount, desc, type }
  ).then((updateList) => {
    res.json(updateList);
  });
});
app.delete("/deleteTranscationList", (req, res) => {
  const id = req.body;
  Transcationlist.deleteOne({ _id: new mongoose.Types.ObjectId(id) }).then(
    (result) => {
      res.json(result);
    }
  );
});

// Category List APIs
app.get("/getCategoriryList", (req, res) => {
  CategoryList.find({}).then((result) => {
    // console.log(result)
    res.json(result);
  });
});
app.post("/createCategoryList", (req, res) => {
  const { name, type } = req.body;

  CategoryList.create({ name, type }).then((result) => {
    res.json(result);
  });
});

app.put("/updateCategoryList", (req, res) => {
  const { id, name, type } = req.body;
  CategoryList.updateOne(
    { _id: new mongoose.Types.ObjectId(id) },
    { name, type }
  ).then((result) => {
    res.json(result);
  });
});
app.delete("/deleteCategoryList", (req, res) => {
  const id = req.body;
  console.log(id);
  CategoryList.deleteOne({ _id: new mongoose.Types.ObjectId(id) }).then(
    (result) => {
      res.json(result);
    }
  );
});
