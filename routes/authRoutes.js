const express = require("express");
const { getLoginForm, login, getRegister, register, logout } = require("../controllers/authController");
const userRoutes = express.Router();

userRoutes.get("/auth/login",getLoginForm)

userRoutes.post("/auth/login",login)

userRoutes.get("/auth/register",getRegister)

userRoutes.post("/auth/register",register)

userRoutes.get("/auth/logout",logout)

module.exports = userRoutes