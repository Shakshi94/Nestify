const Listing = require("../models/listings.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allList = await Listing.find();
    res.render("listing/index.ejs", { allList });
};

module.exports.renderCreateForm = (req, res) => {
    res.render("listing/new.ejs");
};

module.exports.show = async(req, res) => {
    const { id } = req.params;
    const pList = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"},}).populate("owner");
    if(!pList){
      req.flash('error','Listing you requested does not exist');
      return res.redirect("/listing");
    }
    res.render('listing/show.ejs', { pList });
};

module.exports.search = async(req,res)=>{
  let q = req.query.q;
  const regex = new RegExp(q,'i');
  let searchResult = await Listing.find({ country:regex });
  if(!q){
  
       req.flash('error','you have to give country name for search !');
       return res.redirect("/listing");

  }
  res.render('listing/search.ejs',{ searchResult });
  
};

module.exports.category = async (req,res) =>{
        let categoryName = req.params.name;
        let allList = await Listing.find({ category: categoryName });
        res.render('listing/index.ejs',{allList});
        

};

module.exports.createListing = async(req, res, next) => {
    
   let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
        })
        .send()

    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "New Listing Created !");
    res.redirect("/listing");
};

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash('error','Listing you requested does not exist');
       return res.redirect("/listing");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl =  originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listing/edit.ejs", { listing, originalImageUrl });
};

module.exports.updatelisting = async(req, res) => {
    let { id } = req.params;
    let listing =  await Listing.findByIdAndUpdate(id, {...req.body.listing });

    if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }   
    req.flash("success", "Listing Updated !");
    res.redirect(`/listing/${id}`);
};

module.exports.deleteListing = async(req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted !");
    res.redirect("/listing");
}