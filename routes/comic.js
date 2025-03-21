const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.get("/comics", async (req, res) => {
  try {
    let { page, limit, title } = req.query;

    let filters = "";

    if (limit) {
      filters += `&limit=${limit}`;
    } else {
      limit = 100;
    }
    let skip = (page - 1) * limit;
    if (title) {
      filters += `&title=${title}`;
    }
    if (page) {
      filters += `&skip=${skip}`;
    }

    const data = await axios(
      `https://lereacteur-marvel-api.herokuapp.com/comics?${filters}&apiKey=${process.env.YOUR_API_KEY}`
    );
    const comics = data.data;
    return res.status(200).json(comics);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/comic/:comicid", async (req, res) => {
  try {
    const comicId = req.params.comicid;

    const data = await axios(
      `https://lereacteur-marvel-api.herokuapp.com/comic/${comicId}?apiKey=${process.env.YOUR_API_KEY}`
    );

    const comic = data.data;
    return res.status(200).json(comic);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/comics/:characterid", async (req, res) => {
  try {
    const characterId = req.params.characterid;

    const data = await axios(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${characterId}?apiKey=${process.env.YOUR_API_KEY}`
    );

    const comics = data.data.comics;

    return res.status(200).json(comics);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
