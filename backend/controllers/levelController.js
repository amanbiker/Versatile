const Level = require("../models/levelModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
const Product = require("../models/productModel");

exports.createLevel = catchAsyncErrors(async (req, res, next) => {
  const imageBuffer = req.body.images;
  const productName = req.body.product;

  if (!imageBuffer) {
    return next(new Error("No image file provided"));
  }

  if (!productName) {
    return res.status(400).json({ error: "Product name is required" });
  }
  
  // Upload image to Cloudinary
  const result = await cloudinary.uploader.upload(imageBuffer, {
    folder: "products",
    resource_type: "auto",
  });


  const imagesLinks = [{
    public_id: result.public_id,
    url: result.secure_url,
  }];

  // Save image and user
  req.body.images = imagesLinks;
  req.body.user = req.user.id;


  // Find product by name
  const product_name = productName.toLowerCase();
  const desiredProduct = await Product.findOne({
  name: { $regex: new RegExp(`^${product_name}$`, "i") }
});


  if (!desiredProduct) {
    return res.status(404).json({ error: "Product not found" });
  }

  req.body.product = desiredProduct._id;

  // Create the Level document
  const level = await Level.create(req.body);
  

  res.status(201).json({
    success: true,
    level,
  });
});


exports.getLevelsPermittedToUsers = catchAsyncErrors(async (req, res, next) => {

    const userId  = req.user.id;

  try {
    const levels = await Level.find({ permittedUsers: userId }).populate("product");

    // Group levels under categories
    const grouped = {};
    levels.forEach(level => {
      const catName = level.product.name;
      if (!grouped[catName]) grouped[catName] = [];
      grouped[catName].push(level);

    });

    res.status(200).json({ permittedLevels: grouped });
  } catch (error) {
    res.status(500).json({ message: "Error fetching permitted levels", error });
  }


 });


 exports.getAdminLevels = catchAsyncErrors(async (req, res, next) => {
   const levels = await Level.find();
 
   res.status(200).json({
     success: true,
     levels,
   });
 });
 
 
exports.getAdminLevelsById = catchAsyncErrors(async (req, res, next) => {
  // Assuming req.user contains the authenticated admin's info
  if (!req.user || !req.user._id) {
    return res.status(401).json({ success: false, message: "User not authenticated" });
  }
  const levels = await Level.find({ user: req.user._id });      //user id se products fetch

  res.status(200).json({
    success: true,
    levels,
  });
});
 
exports.getLevelDetails = catchAsyncErrors(async (req, res, next) => {
  const level = await Level.findById(req.params.id);

  if (!level) {
    return next(new ErrorHander("Level not found", 404));
  }

  res.status(200).json({
    success: true,
    level,
  });
});

exports.updateLevel = catchAsyncErrors(async (req, res, next) => {
  let level = await Level.findById(req.params.id);

  if (!level) {
    return next(new ErrorHander("Level not found", 404));
  }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < level.images.length; i++) {
      await cloudinary.uploader.destroy(level.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  level = await Level.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    level,
  });
});

exports.deleteLevel = catchAsyncErrors(async (req, res, next) => {
  const level = await Level.findById(req.params.id);

  if (!level) {
    return next(new ErrorHander("Level not found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; level.images && i < level.images.length; i++) {
    await cloudinary.uploader.destroy(level.images[i].public_id);
  }

  await level.remove();

  res.status(200).json({
    success: true,
    message: "Level Delete Successfully",
  });
});