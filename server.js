const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const CoinChart = require('./chartmodel');
const registrations = require("./signupmodel");
const addnew = require("./addprofile");
const salt =10;

const app = express();

app.use(cookieParser());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "https://nextjsfrontend-six.vercel.app");
    res.header('Access-Control-Allow-Methods', ["GET","HEAD","PUT","PATCH","POST","DELETE"]);
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    next();
  });
app.use(express.json());
app.use(cors(
    {
        origin:["https://nextjsfrontend-six.vercel.app"],
        methods:["GET","HEAD","PUT","PATCH","POST","DELETE"],
        credentials:true
    }
));


mongoose.connect('mongodb+srv://veeramallavamsi72:Vamsi2662@cluster0.65d9vmj.mongodb.net/?retryWrites=true&w=majority').then(
    ()=>console.log("Db connected......")
).catch(err=>console.log(err))
app.get("/",(req,res)=>{
    return res.json("Hello Man")
})
app.get("/getallcharts",async(req,res)=>{
    try{
        const chartData = await CoinChart.find();
        return res.json(chartData);
    }
    catch(e)
    {
        console.log("something is wrong in fetching data");
        return res.json("something is wrong");
    }

})

const verifyUser = (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.json({Error:"you are not authenticated"});
    }
    else{
       jwt.verify(token,"jwt-secret-key",(err,decoded)=>{
        if(err)
        {
            return res.json({Error:"token is not correct"})
        }
        else{
            req.email=decoded.email;
            next();
        }
       })
    }
}
app.get('/checking',verifyUser,(req,res)=>{
    return res.json({Status:"Success",email: req.email})
})

app.post("/signup",async(req,res)=>{
    const {email,password,authpro} = req.body;
    
    try{
        const check = await registrations.findOne({email:email});
        if(check)
        {
            return res.json("alreadyexist");
        }
        else{
            if(authpro === "afsuritothme")
            {
                const saltround = await bcrypt.genSalt(salt);
                const hashedpassword = await bcrypt.hash(password,saltround);
    
                const newData = new registrations({email:email,password:hashedpassword});
                await newData.save();
                return res.json("success");
            }
            else{
                return res.json("sorry you are not allowed to register");
            }

           
        }
    }
    catch(e)
    {
        console.log(e);
    }
})
app.get('/logout',(req,res)=>{
    res.clearCookie('token',{httpOnly: true, secure: true,sameSite:'None'});
    return res.json({Status:"Success"});
})

app.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    
    try{
        const userCheck = await registrations.findOne({email:email});
        if(!userCheck)
        {
            return res.json("notexist");
        }
        else{

            const passwordCheck = await bcrypt.compare(password,userCheck.password);

            if(passwordCheck)
            {
                const token = jwt.sign({email},"jwt-secret-key",{expiresIn:"1d"});
                res.cookie("token",token,{maxAge:30000, httpOnly: true, secure: true,sameSite:'None' });
                return res.json({status:"success",tok:token});
            }
            else{
                return res.json("invalidpassword");
            }
        }
    }
    catch(e)
    {
        console.log(e);
        return res.json("error");
    }
})

app.post('/modalinsert',async(req,res)=>{
    const {name,email,phno}=req.body;
    try{
        const check = await addnew.findOne({email:email});
        if(check)
        {
            return res.json("exist");
        }
        else{
            const newProfile = await addnew({name,email,phno});
            await newProfile.save();
            return res.json("success");
        }
    }catch(e)
    {
        console.log(e);
    }
})

app.post('/modaldata',async(req,res)=>{
    const {email} = req.body;
    try{
        const check=await addnew.findOne({email:email});
        if(!check)
        {
            return res.json({status:"fail"});
        }
        else{
            const responseData = {
                status: "success",
                email: check.email,
                name: check.name,
                phno: check.phno
              };
              return res.json(responseData);
        }
    }catch(e){ console.log(e)
    return res.json("notexist")}
})

app.listen(process.env.PORT || 4000);
module.exports = app
