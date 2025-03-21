const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");

const router = express.Router();

const User = require("../models/User");

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const isAuthenticated = require("../middleware/isAuthenticated");

router.post("/user/signup", async (req, res) => {
  try {
    if (!req.body.username || !req.body.password || !req.body.email) {
      return res
        .status(400)
        .json({ message: "Please fill all the parameters" });
    }
    const mailExists = await User.findOne({ email: req.body.email });
    if (mailExists !== null) {
      return res.status(409).json({ message: "Mail already exists" });
    }
    const salt = uid2(16);
    console.log(salt);
    const token = uid2(64);
    console.log(token);
    const passwordSalt = req.body.password + salt;
    console.log(passwordSalt);
    const hash = SHA256(passwordSalt).toString(encBase64);
    console.log(hash);

    const newUser = new User({
      email: req.body.email,
      account: {
        username: req.body.username,
      },
      token: token,
      hash: hash,
      salt: salt,
    });

    await newUser.save();

    const toReturn = {
      _id: newUser.id,
      token: newUser.token,
      account: {
        username: newUser.account.username,
      },
    };

    console.log(newUser);

    return res.status(201).json(toReturn);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const userToFind = await User.findOne({ email: req.body.email });

    if (!userToFind) {
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      const hash2 = SHA256(req.body.password + userToFind.salt).toString(
        encBase64
      );
      if (hash2 === userToFind.hash) {
        const toReturn = {
          _id: userToFind.id,
          token: userToFind.token,
          account: {
            username: userToFind.account.username,
          },
        };
        return res.status(200).json(toReturn);
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post(
  "/user/favourites/characters",

  async (req, res) => {
    try {
      const userToFind = await User.findOne({ token: req.body.token });
      if (!userToFind) {
        return res.status(401).json({ message: "Unauthorized" });
      } else if (
        userToFind.favourites_characters.includes(req.body.favouriteId)
      ) {
        return res.status(400).json({ message: "Already in favourites" });
      } else {
        userToFind.favourites_characters.push(req.body.favouriteId);
        await userToFind.save();
      }
      const toReturn = userToFind;

      return res.status(200).json(toReturn);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

router.post("/user/favourites/comics", async (req, res) => {
  try {
    const userToFind = await User.findOne({ token: req.body.token });
    if (!userToFind) {
      return res.status(401).json({ message: "Unauthorized" });
    } else if (userToFind.favourites_comics.includes(req.body.favouriteId)) {
      return res.status(400).json({ message: "Already in favourites" });
    } else {
      userToFind.favourites_comics.push(req.body.favouriteId);
      await userToFind.save();
    }
    const toReturn = userToFind;

    return res.status(200).json(toReturn);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/user/favourites/characters", isAuthenticated, async (req, res) => {
  try {
    isAuthenticated;
    const userToken = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({ token: userToken });
    const favourites = user.favourites_characters;
    const favTab = [];

    for (let i = 0; i < favourites.length; i++) {
      const data = await axios(
        `https://lereacteur-marvel-api.herokuapp.com/character/${favourites[i]}?apiKey=${process.env.YOUR_API_KEY}`
      )
        .then((response) => {
          favTab.push(response.data);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }

    return res.status(200).json(favTab);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/user/favourites/comics", isAuthenticated, async (req, res) => {
  try {
    isAuthenticated;
    const userToken = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({ token: userToken });
    const favourites = user.favourites_comics;
    const favTab = [];

    for (let i = 0; i < favourites.length; i++) {
      const data = await axios(
        `https://lereacteur-marvel-api.herokuapp.com/comic/${favourites[i]}?apiKey=${process.env.YOUR_API_KEY}`
      )
        .then((response) => {
          favTab.push(response.data);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }

    return res.status(200).json(favTab);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
