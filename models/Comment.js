const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true,
    },
    post:{
        type: String,
        required: true,
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Post"
        
    },
},{
    timestamps:true
})

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment;