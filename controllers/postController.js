const asynchandler = require("express-async-handler");
const File = require("../models/File");
const Post = require("..//models/Post");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

exports.getPostform=asynchandler((req,res)=>{
    res.render("newPost",{
        title:"Create Post",
        user:req.user,
        error:"",
        success:"",
    })
})

exports.createPost = asynchandler(async(req,res)=>{
    const {title,content}=req.body;
    // if(!req.files || req.files.length===0) {
    //     return res.render("newPost",{
    //         title:"Create Post",
    //         user:req.user,
    //         error:"atleast one image is required",
    //         success:"",
    //     })
    // }

    const images = await Promise.all(req.files.map(async (file)=>{
        console.log(file);
        const newFile = new File({
            url:file.path,
            public_id:file.filename,
            uploaded_by:req.user._id,
        });
        await newFile.save();
        console.log(newFile);
        
        return {
            url:newFile.url,
            public_id:newFile.public_id,
        }
    }))

    const newPost = new Post({
        title,
        content,
        author:req.user._id,
        images,
    })
    await newPost.save();
    res.render("newPost",{
        title:"Create Post",
        user:req.user,
        error:"",
        success:"Post created successfully"
    })
})

exports.getPosts =asynchandler(async(req,res)=>{
    const posts = await Post.find().populate("author","username");
    res.render("Posts",{
        title:"Posts",
        posts,
        user:req.user,
        success:"",
        error:"",
    })
})

exports.getPostById = asynchandler(async(req,res)=>{
    const post = await Post.findById(req.params.id).populate("author","username").populate({
        path:"comments",
      populate:  {
            path:"author",
            model:"User",
            select:"username",
        },
    });
    // console.log('Current User ID:', req.user ? req.user._id : null); // Log current user ID
    // console.log('Post Author ID:', post.author ? post.author._id : null); // Log post author ID
    console.log(post);
    
    res.render("postDetails",{
        title:"postDetails",
        post,
        user:req.user,
        success:"",
        error:"",
    })
})


exports.getEditPostForm = asynchandler(async(req,res)=>{
    const post = await Post.findById(req.params.id)
    if(!post){
        res.render("postDetails",{
            title:"postDetails",
            post,
            user:req.user,
            success:"",
            error:"Post not found",
        })
    }
    res.render("editPost",{
        title:"Edit Post",
        post,
        user:req.user,
        error:"",
        succes:"",
    })
})

exports.updataPost = asynchandler(async(req,res)=>{
    const {title,content} = req.body;

    const post = await Post.findById(req.params.id);
    if(!post){
        return res.render("postDetails",{
            title:"Post",
            post,
            user:req.user,
            error:"Post not found",
            success:"",
        })
    }

    if(post.author.toString()!== req.user._id.toString()){
        return res.render("postDetails",{
            title:"Post",
            post,
            user: req.user,
            error:"you are not allowed to edit this post",
            success:"",
        })
    }

    post.title = title || post.title;
    post.content = content || post.content;

    if(req.files){
        await Promise.all(post.images.map(async(image)=>{
            await cloudinary.uploader.destroy(image.public_id)
        }))
    }

    post.images = await Promise.all(
        req.files.map(async(file)=>{
            const newFile =new File({
                url:file.path,
                public_id:file.filename,
                uploaded_by:req.user._id,
            })
            await newFile.save();
            return{
                url:newFile.url,
                public_id:newFile.public_id,
            }
        })
    )
    await post.save();

    res.redirect(`/posts/${post._id}`)
    
})


exports.deletePost = asynchandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if(!post){
        return res.render("postDetails",{
            title:"Post",
            post,
            user:req.user,
            error:"Post not found",
            success:"",
        })
    }
    if(post.author.toString()!== req.user._id.toString()){
        return res.render("postDetails",{
            title:"Post",
            post,
            user: req.user,
            error:"you are not allowed to edit this post",
            success:"",
        })
    }
    await Promise.all(
        post.images.map(async (image)=>{
            await cloudinary.uploader.destroy(image.public_id)
        })
    )
    await Post.findByIdAndDelete(req.params.id)
    res.redirect("/posts")
})