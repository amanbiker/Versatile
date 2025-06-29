const mongoose = require("mongoose");

const levelSchema = mongoose.Schema({
  // name: {
  //   type: String,
  //   required: [true, "Please Enter level Name"],
  //   trim: true,
  // },
  levelNumber: {
    type: String,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    // type: String,
    ref: "Product",
    required: true,
  },
  permittedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }],

  description: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, "Please Enter product Price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  
  images: [
    {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  ],

  stock: {
    type: Number,
    required: [true, "Please Enter product Stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
  },
  
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Level", levelSchema);
