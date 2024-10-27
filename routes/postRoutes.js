const express = require("express");
const { getPostform, createPost, getPosts, getPostById, getEditPostForm, updataPost, deletePost } = require("../controllers/postController");
const { create } = require("connect-mongo");
const upload = require("../config/multer");
const { ensureAuthenticated } = require("../middlewares/auth");
const postRoutes = express.Router();

postRoutes.get("/add",getPostform)

postRoutes.post("/add",ensureAuthenticated,upload.array("images",5),createPost)

postRoutes.get("/",getPosts)

postRoutes.get("/:id",getPostById)

postRoutes.get("/:id/edit",getEditPostForm )

postRoutes.put("/:id",ensureAuthenticated,upload.array("images",5),updataPost)

postRoutes.delete("/:id",ensureAuthenticated,deletePost)
module.exports = postRoutes;