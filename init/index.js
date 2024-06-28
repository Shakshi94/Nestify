const mongoose = require('mongoose');
const initdata = require("./data.js");
const Listing = require("../models/listings.js");

main().then(() => {
    console.log("conencted succesful to DB");
}).catch((err) => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


const initDB = async() => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj , owner:"6640b15c0bd14f6a45cc5bad"}));
    await Listing.insertMany(initdata.data);
    console.log("data is intailized in DB");
};


initDB();