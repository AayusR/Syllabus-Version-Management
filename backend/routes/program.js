const Program = require("../models/Program.js");
const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

let fileName;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "ProgramImages/");
  },
  filename: (req, file, cb) => {
    fileName = Date.now() + path.extname(file.originalname);
    console.log(file);
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("img"), async (req, res) => {
  return res.status(200).json(fileName);
});

router.post("/create", async (req, res) => {
  try {
    const newProgram = new Program({
      name: req.body.name,
      imgString: req.body.imgString,
      programCode: req.body.programCode,
    });

    console.log(newProgram);
    const savedProgram = await newProgram.save();
    return res.status(200).json(savedProgram);
  } catch (error) {
    return res.status(200).json(error);
  }
});

router.put("/:programCode", async (req, res) => {
  try {
    const getProgramId = await Program.findOne({
      programCode: req.params.programCode,
    });
    const filePath =
      "/home/aditya/softaware-engineering/backend/ProgramImages/" +
      getProgramId.imgString;
    fs.unlink(filePath, () => {
      console.log("Image has been removed from the server");
    });

    console.log(getProgramId._id);
    const getProgram = await Program.findByIdAndUpdate(
      getProgramId._id,
      {
        ...req.body,
      },
      { new: true }
    );
    return res.status(200).json(getProgram);
  } catch (error) {
    return res.status(404).json(error);
  }
});

router.delete("/:programCode", async (req, res) => {
  try {
    const getProgramId = await Program.findOne({
      programCode: req.params.programCode,
    });
    const programDeleted = await Program.findByIdAndDelete(getProgramId._id);
    const filePath =
      "/home/aditya/softaware-engineering/backend/ProgramImages/" +
      programDeleted.imgString;
    fs.unlink(filePath, () => {
      console.log("Image has been removed from the server");
    });
    return res.status(200).json("File Deleted");
  } catch (error) {
    return res.status(404).json(error);
  }
});

router.get("/all", async (req, res) => {
  try {
    const allPrograms = await Program.find();
    return res.status(200).json(allPrograms);
  } catch (error) {
    return res.status(404).json(error);
  }
});

module.exports = router;
