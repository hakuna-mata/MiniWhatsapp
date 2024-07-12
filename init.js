const mongoose = require("mongoose")
let Chat = require("./models/chats.js")

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp")
}

main().then(()=>{
    console.log("Connection successful");
}).catch(e=>e)

const allChats = [
    {
        from:"Neha",
        to:"Ramya",
        msg:"Send me your exam sheets",
        created_at:Date.now()
    },
    {
        from:"Amit",
        to:"Nehal",
        msg:"Come let's learn web development",
        created_at:Date.now()
    },
    {
        from:"Rutu",
        to:"Rishabh",
        msg:"Teach me JS callbacks",
        created_at:Date.now()
    },
    {
        from:"Ananya",
        to:"Oorvi",
        msg:"Do you wanna have something",
        created_at:Date.now()
    },
    {
        from:"Rahul",
        to:"Athiya",
        msg:"Come let's explore the world",
        created_at:Date.now()
    },
]

Chat.insertMany(allChats).then((res)=>{
    console.log(res);
}).catch((e)=>{
    console.log(e);
})