const Subject = require("../models/Subject.js");
const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

//img-upload
let fileName1;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "SubjectImages/");
  },
  filename: (req, file, cb) => {
    fileName1 = Date.now() + path.extname(file.originalname);
    console.log(file);
    cb(null, fileName1);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("img"), async (req, res) => {
  return res.status(200).json(fileName1);
});

//file upload
let fileName2;

const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "SubjectPdf/");
  },
  filename: (req, file, cb) => {
    fileName2 = Date.now() + path.extname(file.originalname);
    console.log(file);
    cb(null, fileName2);
  },
});

const upload1 = multer({ storage: storage1 });

router.post("/upload-file", upload1.single("file"), async (req, res) => {
  return res.status(200).json(fileName2);
});

router.post("/create", async (req, res) => {
  try {
    const newSubject = new Subject({
      name: req.body.name,
      imgString: req.body.imgString,
      semester: req.body.semester,
      subjectCode: req.body.subjectCode,
      parentProgramCode: req.body.parentProgramCode,
      syllabus: req.body.syllabus,
    });

    const savedObject = await newSubject.save();

    return res.status(200).json(savedObject);
  } catch (error) {
    return res.status(404).json(error);
  }
});

router.put("/:subjectCode", async (req, res) => {
  try {
    const getSubject = await Subject.findOne({
      subjectCode: req.params.subjectCode,
    });
    const updated = await Subject.findByIdAndUpdate(
      getSubject._id,
      {
        ...req.body,
      },
      { new: true }
    );
    console.log(updated);
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(404).json(error);
  }
});

router.put("/new-version/:subjectCode", async (req, res) => {
  try {
    const getSubject = await Subject.findOne({
      subjectCode: req.params.subjectCode,
    });
    const updatedVersion = await Subject.findByIdAndUpdate(
      getSubject._id,
      {
        $push: {
          syllabus: req.body.syllabus,
        },
      },
      { new: true }
    );
    return res.status(200).json(updatedVersion);
  } catch (error) {
    return res.status(404).json(error);
  }
});
router.delete("/:subjectCode", async (req, res) => {
  try {
    const getSubject = await Subject.findOne({
      subjectCode: req.params.subjectCode,
    });
    const subjectDeleted = await Subject.findByIdAndDelete(getSubject._id);
    console.log(subjectDeleted);
    const filePath =
      "/home/aditya/softaware-engineering/backend/SubjectImages/" +
      subjectDeleted.imgString;
    fs.unlink(filePath, () => {
      console.log("Image has been removed from the server");
    });
    const lengthPdf = subjectDeleted.syllabus.length;
    for (let i = 0; i < lengthPdf; i++) {
      const filePath1 =
        "/home/aditya/softaware-engineering/backend/SubjectPdf/" +
        subjectDeleted.syllabus[i].pdf;
      fs.unlink(filePath1, () => {
        console.log("Pdf Deleted " + subjectDeleted.syllabus[i].pdf);
      });
    }

    return res.status(200).json("File Deleted");
  } catch (error) {
    return res.status(404).json(error);
  }
});

router.get("/all", async (req, res) => {
  try {
    const allSubjects = await Subject.find();
    return res.status(200).json(allSubjects);
  } catch (error) {
    return res.status(404).json(error);
  }
});

router.get("/:subjectCode", async (req, res) => {
  try {
    const getSubject = await Subject.findOne({
      subjectCode: req.params.subjectCode,
    });
    return res.status(200).json(getSubject);
  } catch (error) {
    return res.status(404).json(error);
  }
});

//get particular subject under  a parent program
router.get("/parent/:parentCode", async (req, res) => {
  try {
    // console.log(req.params.parentCode);
    const subject = await Subject.find({
      parentProgramCode: { $in: [req.params.parentCode] },
    });

    return res.status(200).json(subject);
  } catch (errro) {
    return res.status(404).json(error);
  }
});

//get subject by semester
router.get("/semester/:semester", async (req, res) => {
  try {
    const subject = await Subject.find({ semester: req.params.semester });
    return res.status(404).json(subject);
  } catch (error) {
    return res.status(404).json(error);
  }
});

router.get("/get-latest-version/:subjectCode", async (req, res) => {
  try {
    const getSubject = await Subject.findOne({
      subjectCode: req.params.subjectCode,
    });
    console.log(getSubject);
    const sortedSyllabus = getSubject.syllabus;
    const length = sortedSyllabus.length;
    return res.status(200).json(sortedSyllabus[length - 1]._id);
  } catch (error) {
    return res.status(404).json(error);
  }
});
router.put("/update-syllabus-pdf/:subjectCode", async (req, res) => {
  console.log(req.body.id);
  console.log(req.body.pdf);
  try {
    // const updated = await Subject.findOneAndUpdate(
    //   { subjectCode: req.params.subjectCode },
    //   {
    //     $set: { [`syllabus.$[outer].pdf`]: req.body.pdf },
    //   },
    //   {
    //     arrayFilters: [{ "outer.id": req.body.id }],
    //   }
    // );
    const updated = await Subject.updateOne(
      { subjectCode: req.params.subjectCode, "syllabus._id": req.body.id },
      {
        $set: {
          "syllabus.$.pdf": req.body.pdf,
        },
      }
    );
    // Person.findOneAndUpdate({_id: id},
    //   {
    //     "$set": {[`items.$[outer].${propertyName}`]: value}
    //   },
    //   {
    //     "arrayFilters": [{ "outer.id": itemId }]
    //   }
    return res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
});

// let userData = {productCode: "4pf"}
// let dataToBeUpdated = {claims: ["abc", "def"]}
// ProductModel.findOneAndUpdate({"products.productCode": userData.productCode}, {$set: {"products.$": dataToBeUpdated}})
module.exports = router;
