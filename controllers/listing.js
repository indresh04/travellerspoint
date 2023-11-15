const Listing = require("../models/listing")


module.exports.index = async (req,res)=>{
    let allListing = await Listing.find({});
  
    res.render("index.ejs",{allListing})
};

module.exports.renderNewForm = (req, res)=>{
    res.render("new.ejs")};

module.exports.showListing = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate( {path:"reviews", populate: {path: "author"}}).populate("owner");
    if (! listing){
      req.flash("error", "Listing you requested for doesn't exist !");
      res.redirect("/listing")
    };
    console.log(listing)
    res.render("show.ejs",{listing})  
};

module.exports.createNewListing = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
const newListing = new Listing(req.body.listing);
    console.log(req.user)
    newListing.owner = req.user._id;
    newListing.image = { url , filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listing")
};

module.exports.editListing = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing){
      req.flash("error", "Listing you requested for doesn't exist !");
      res.redirect("/listing")
    };
    let originalimageUrl = listing.image.url;
    originalimageUrl = originalimageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("edit.ejs",{listing ,originalimageUrl})
};

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if( typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }
      req.flash("success", "Listing updated !");
    res.redirect(`/listing/${id}`);
};

module.exports.deleteListing = async (req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted !");
    res.redirect("/listing")
  };