const express = require("express");
const commentRoutes = express.Router();
const {ensureAuthenticated} = require("../middlewares/auth");
const { addComment, getCommentForm, updateComment, deleteComment } = require("../controllers/commentControllers");
const { get } = require("mongoose");


commentRoutes.post("/posts/:id/comments", ensureAuthenticated,addComment);

commentRoutes.get("/comments/:id/edit", ensureAuthenticated,getCommentForm)

commentRoutes.put("/comments/:id",ensureAuthenticated,updateComment);

commentRoutes.delete("/comments/:id",ensureAuthenticated,deleteComment);



module.exports = commentRoutes;