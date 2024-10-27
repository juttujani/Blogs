const express = require("express");
const { getUserProfile, getEditProfileForm, updateUserProfile, deleteUserAccount } = require("../controllers/userContoller");
const { ensureAuthenticated } = require("../middlewares/auth");
const upload = require("../config/multer");
const profileRoutes = express.Router();

profileRoutes.get("/profile", ensureAuthenticated,getUserProfile)

profileRoutes.get("/edit", ensureAuthenticated,getEditProfileForm)

profileRoutes.post("/edit", ensureAuthenticated,upload.single("profilePicture"),updateUserProfile)

profileRoutes.post("/delete", ensureAuthenticated,deleteUserAccount)

module.exports = profileRoutes;