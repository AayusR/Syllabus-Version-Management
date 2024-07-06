const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  imgString: {
    type: String,
    required: true,
  },
  programCode: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Program", ProgramSchema);
