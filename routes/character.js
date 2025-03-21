const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.get("/characters", async (req, res) => {
  try {
    let { page, name, limit } = req.query;

    let filters = "";

    if (limit) {
      filters += `&limit=${limit}`;
    } else {
      limit = 100;
    }

    let skip = (page - 1) * limit;

    if (name) {
      filters += `&name=${name}`;
    }
    if (page) {
      filters += `&skip=${skip}`;
    }

    const data = await axios(
      `https://lereacteur-marvel-api.herokuapp.com/characters?${filters}&apiKey=${process.env.YOUR_API_KEY}`
    );
    const characters = data.data;

    return res.status(200).json(characters);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/character/:characterid", async (req, res) => {
  try {
    const characterId = req.params.characterid;

    const data = await axios(
      `https://lereacteur-marvel-api.herokuapp.com/character/${characterId}?apiKey=${process.env.YOUR_API_KEY}`
    );

    const character = data.data;

    return res.status(200).json(character);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//"https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=" +process.env.YOUR_API_KEY,

module.exports = router;
