const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();
const app = express();
const PORT = 3000;


app.use(express.json());
app.use(cors());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

const tabSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
});

const Tab = mongoose.model("Tab", tabSchema);

app.post("/tabs", async (req, res) => {
  const { name, url } = req.body;

  if (!name || !url) {
    return res.status(400).json({ message: "Name and URL are required." });
  }

  try {
    const newTab = new Tab({ name, url });
    await newTab.save();
    res.status(201).json({ message: "Tab saved successfully!", tab: newTab });
  } catch (error) {
    res.status(500).json({ message: "Failed to save tab.", error });
  }
});

app.get("/tabs", async (req, res) => {
  try {
    const tabs = await Tab.find();
    res.status(200).json(tabs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tabs.", error });
  }
});

app.delete("/tabs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Tab.findByIdAndDelete(id);
    res.status(200).json({ message: "Tab deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete tab.", error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
