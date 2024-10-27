require("dotenv").config();
const express  = require("express")
const app = express()
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session")
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo")
const User = require("./models/User");
const userRoutes = require("./routes/authRoutes");
const passportconfig = require("./config/passport");
const postRoutes = require("./routes/postRoutes");
const errorHandler = require("./middlewares/errorHandler");
const commentRoutes = require("./routes/commentRoute");
const profileRoutes = require("./routes/profileRoutes");
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))

app.use(session(
    {
        secret:"keyboard cat",
        resave:false,
        saveUnitialized:false,
        store:MongoStore.create({mongoUrl:process.env.MONGODB_URL})
    }
))
app.use(methodOverride('_method'));
passportconfig(passport)
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine","ejs")

app.get("/",(req, res) => {
    res.render("home",{
        user:req.user,
        error:"",
        title:"Home"
    })
})
app.use("/",userRoutes)
app.use("/posts",postRoutes)
app.use("/",commentRoutes);
app.use("/user",profileRoutes);

app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("db connected");
    
    app.listen(port, ()=>{
        console.log(`server is running on http://localhost:${port}`)
    })
}).catch(()=>{
    console.log("database connection failed")
})
