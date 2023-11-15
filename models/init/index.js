const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../listing")
const mongo_url ="mongodb://127.0.0.1:27017/air";




main()
.then(()=>{
    console.log("connected to db")
})
.catch((err)=>{
    console.log("error is ",err)
})

async function main(){
    await mongoose.connect(mongo_url);
};

const initDB = async()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map( (obj) => ({...obj, owner : "654cc48d72242a2c4655851f"}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialised")

};


initDB();