const mongoose = require("mongoose");
const db = 'mongodb+srv://kim:1234@cluster0.omtzp.mongodb.net/database1?retryWrites=true&w=majority';
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log('Da ket noi co so du lieu');
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

module.exports = connectDB;


