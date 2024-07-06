const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/auth.js");
const programRoute = require("./routes/program.js");
const subjectRoute = require("./routes/subject.js");
const path = require("path");
const cors = require("cors");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});
app.use(
    "/program-image",
    express.static(path.join(__dirname, "ProgramImages"))
);
app.use(
    "/subject-image",
    express.static(path.join(__dirname, "SubjectImages"))
);
app.use("/subject-pdf", express.static(path.join(__dirname, "SubjectPdf")));

// routes
app.use("/api/auth", userRoute);
app.use("/api/program", programRoute);
app.use("/api/subject", subjectRoute);
const PORT=7132
mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log("Database is running");
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
