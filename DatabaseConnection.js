const mongoose=require("mongoose");
require("dotenv").config();
dbConnect()
async function dbConnect(){
    try{
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri, { useNewUrlParser: true });
        console.log("Connection successfull")
    }catch(error){
            console.log("connection failed");
    }
}


module.exports=mongoose;