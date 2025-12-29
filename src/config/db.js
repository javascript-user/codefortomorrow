const mongoose = require("mongoose");

module.exports = async () => {
  await mongoose.connect(process.env.MONGOOSE_URI);
  console.log("db was connected");
};
