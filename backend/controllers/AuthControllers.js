const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const UserModel = require("../models/UserModel");
const { errorHandler } = require("../errors/errorHandler");
dotenv.config();

const { JWT_SECRET_KEY, COOKIE_NAME, NODE_ENV } = process.env;
const maxAge = 60 * 60 * 24 * 1;

const options = {
  httpOnly: true,
  secure: NODE_ENV !== "development",
  sameSite: "strict",
  maxAge: maxAge,
  path: "/",
};

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET_KEY);
};

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.create({
      email,
      password,
    });

    const token = generateToken(user._id);
    res.cookie(COOKIE_NAME, token, options);
    res.status(201).json({ created: true });
  } catch (err) {
    console.log(err);
    const errors = errorHandler(err);
    res.json({ errors, created: false });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.login(email, password);

    const token = generateToken(user._id);

    res.cookie(COOKIE_NAME, token, options);
    req.session.authenticated = true;
    res.status(200).json({ status: true });
  } catch (err) {
    const errors = errorHandler(err);
    res.json({ errors, status: false });
  }
};

const logoutUser = async (req, res, next) => {
  req.session.authenticated = false;
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }

    res.clearCookie("connect.sid", {
      path: "/",
    });
    res
      .status(200)
      .clearCookie(COOKIE_NAME, {
        path: "/",
      })
      .json({ status: true });
  });
};

const checkIfLoggedIn = async (req, res, next) => {
  if (req.session.authenticated === true) {
    res.status(200).json({ status: true });
  } else {
    res.status(200).json({ status: false });
  }
};
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  checkIfLoggedIn,
};
