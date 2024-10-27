const User = require("../models/User");
const Post = require("../models/Post");
const asynchandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const File = require("../models/File");
const Comment = require("../models/Comment");
exports.getUserProfile = asynchandler(async(req,res)=>{
    const user = await User.findById(req.user._id).select("-password");
    if(!user){
        return res.render("login",{
            title:"Login",
            user:req.user,
            error:"User not found"
        })
    }

    const posts = await Post.find({author:req.user._id}).populate('author', 'username').sort({
        createdAt:-1,
    });
    console.log(posts,user);
    
    res.render("profile",{
        title:"Profile",
        user,
        posts,
        postCount:posts.length,
    })
})


exports.getEditProfileForm = asynchandler(async(req,res)=>{
    const user = await User.findById(req.user._id).select("-password");
    if(!user){
        return res.render("login",{
            title:"Login",
            user:req.user,
            error:"User not found"
        })
    }
    res.render("editprofile",{
        title:"editProfile",
        user,
       error:"",
       success:"",
        
    })
})


exports.updateUserProfile = asynchandler(async (req, res) => {
    const { username, email, bio } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    user.username = username || user.username;
    user.email = email || user.email;
  
    if (req.file) {
      if (user.profilePicture && user.profilePicture.public_id) {
        await cloudinary.uploader.destroy(user.profilePicture.public_id);
      }
      const file = new File({
        url: req.file.path,
        public_id: req.file.filename,
        uploaded_by: req.user._id,
      });
      await file.save();
      user.profilePicture = { url: file.url, public_id: file.public_id };
    }
  
    await user.save();
    res.render("editProfile", {
      title: "Edit Profile",
      user,
      error: "",
      success: "Profile updated successfully",
    });
  });
  
  exports.deleteUserAccount = asynchandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.render("login", {
            title: "Login",
            user: req.user,
            error: "User not found.",
        });
    }

    // Delete user's profile picture from Cloudinary
    if (user.profilePicture && user.profilePicture.public_id) {
        try {
            await cloudinary.uploader.destroy(user.profilePicture.public_id);
            console.log("Deleted profile picture from Cloudinary:", user.profilePicture.public_id);
        } catch (error) {
            console.error("Error deleting profile picture:", error);
        }
    }

    // Fetch all posts by the user
    const posts = await Post.find({ author: req.user._id }); // Ensure 'author' is used instead of 'authors'
    for (const post of posts) {
        // Delete each image in the post from Cloudinary
        for (const image of post.images) {
            if (image.public_id) { // Ensure public_id exists before attempting deletion
                try {
                    await cloudinary.uploader.destroy(image.public_id);
                    console.log("Deleted image from Cloudinary:", image.public_id);
                } catch (error) {
                    console.error("Error deleting image from Cloudinary:", error);
                }
            }
        }

        // Delete comments associated with the post
        await Comment.deleteMany({ post: post._id });
        
        // Delete the post itself
        await Post.findByIdAndDelete(post._id);
    }

    // Delete comments made by the user
    await Comment.deleteMany({ author: req.user._id });

    // Fetch all files uploaded by the user
    const files = await File.find({ uploaded_by: req.user._id });
    for (const file of files) {
        if (file.public_id) { // Ensure public_id exists before attempting deletion
            try {
                await cloudinary.uploader.destroy(file.public_id);
                console.log("Deleted file from Cloudinary:", file.public_id);
            } catch (error) {
                console.error("Error deleting file from Cloudinary:", error);
            }
        }
    }

    // Finally, delete the user account
    await User.findByIdAndDelete(req.user._id);
    res.redirect("/auth/register");
});
