const express = require("express")
const app = express();
const mongoose = require("mongoose")
const path = require("path")
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
const Chat = require("./models/chats.js");
const { log } = require("console");
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}))
const methodOverride = require("method-override")
app.use(methodOverride("_method"))
const MyError = require("./MyError.js")

main().then(()=>{
    console.log("Connection successful");
}).catch((e)=>e)

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp")
}

// let chat1 = new Chat({from:"Rohan",to:"Rahul",msg:"Nice to meet you",created_at:new Date()})
// chat1.save().then((res)=>{
//     console.log(res);
// }).catch(e=>{console.log(e);})

//Index route
app.get("/chats",async(req,res)=>{
    let chats = await Chat.find();
    res.render("index.ejs",{chats})
})

//New route
app.get("/chats/new",(req,res)=>{
    res.render("new.ejs")
})

//Create route
app.post("/chats",asyncWrap((req,res)=>{
    let{from,to,msg}=req.body;
    let newChat = {
        from:from,
        to:to,
        msg:msg,
        created_at:new Date()
    }
    let chat = new Chat(newChat)
    chat.save().then(()=>{
        console.log("Chat sent sucsessfully");
    }).catch(e=>{
        console.log(e);
    })
    res.redirect("/chats")
}))

//AsyncWrap
function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err))
    }
}

//Edit from route
app.get("/chats/:id/edit",asyncWrap(async(req,res,next)=>{
    let{id}=req.params;
    let chat = await Chat.findById(id)
    if(!chat){
        next(new MyError(408,"Chat not found"))
    }
    res.render("edit.ejs",{chat})
}))

//Edit route
app.patch("/chats/:id",asyncWrap(async(req,res)=>{
    let{id}=req.params;
    let{msg}=req.body;
    await Chat.findByIdAndUpdate(id,{msg:msg},{runValidators:true})
    res.redirect("/chats")
}))

app.delete("/chats/:id",asyncWrap(async(req,res)=>{
    let{id}=req.params;
    await Chat.findByIdAndDelete(id);
    res.redirect("/chats")
}))

const handleValidationErr = (err)=>{
    console.log("This is a validation error please follow some rules!!!");
    console.dir(err.message)
    return err
}

app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name==="CastError"){
       err = handleValidationErr(err)
    }
    next(err)
})

app.use((err,req,res,next)=>{
    res.send(err)
})

app.listen(8080,()=>{
    console.log("Listening on port 8080......");
})