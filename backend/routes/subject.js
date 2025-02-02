const Subject = require("../models/Subject.js");
const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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
// Deleting a specific syllabus version
router.delete("/:subjectCode/version/:pdfName", async (req, res) => {
    try {
        const { subjectCode, pdfName } = req.params;

        // Find the subject by subjectCode
        const subject = await Subject.findOne({ subjectCode });

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        // Filter out the syllabus version that matches the pdfName
        const updatedSyllabus = subject.syllabus.filter(
            (syllabus) => syllabus.pdf !== pdfName
        );

        // Update the subject with the new syllabus array
        subject.syllabus = updatedSyllabus;

        // Save the updated subject
        const updatedSubject = await subject.save();

        // Find and delete the associated PDF file from the server
        const filePath = path.join(
            __dirname,
            "..",
            "SubjectPdf",
            pdfName
        );

        fs.unlink(filePath, (err) => {
            if (err) {
                console.log("Error deleting file:", err);
            } else {
                console.log("PDF file deleted:", pdfName);
            }
        });

        return res.status(200).json(updatedSubject);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error", error });
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
            {
                subjectCode: req.params.subjectCode,
                "syllabus._id": req.body.id,
            },
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
