import React, { useState, useEffect } from "react";
import "./CreateSubject.scss";
import { Button } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useSelector } from "react-redux";
const CreateSubject = () => {
  const [name, setName] = useState("");
  const [subjectCode, setSubjectCode] = useState("0");
  const [actualFile, setActualFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [pdfFile, setPdffile] = useState("");
  const [semester, setSemester] = useState("1");
  const [selectedProgram, setSelectedProgram] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(
      name,
      subjectCode,
      selectedProgram,
      semester,
      fileName,
      pdfName
    );

    if (actualFile && pdfFile) {
      const fileData = new FormData();
      fileData.append("img", actualFile);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      const response = await axios.post(
        `/api/subject/upload`,
        fileData,
        config
      );

      const pdfData = new FormData();
      pdfData.append("file", pdfFile);

      const response1 = await axios.post(
        "/api/subject/upload-file",
        pdfData,
        config
      );

      // const selectedParents = [];

      // for (let i = 0; i < selectedProgram.length; i++) {
      //   // selectedParents.push(selectedProgram[i].value);
      //   console.log(selectedProgram[i].value);
      // }

      // console.log(selectedParents);
      const response2 = await axios.post(`/api/subject/create`, {
        imgString: response.data,
        syllabus: [
          {
            pdf: response1.data,
            version: "version-1",
          },
        ],
        name,
        subjectCode,
        semester,
        parentProgramCode: selectedProgram,
      });

      // const response2 = await axios.post(`/api/subject/create`, {
      //   imgString: response.data,
      //   syllabus: response1.data,
      //   name,
      //   subjectCode,
      //   semester,
      //   parentProgramCode: selectedProgram,
      // });
      console.log(response2.data);
      if (response2.status === 200) {
        navigate("/");
      }
    }
  };

  const handleSelectedProgram = (e) => {
    setSelectedProgram(
      Array.from(e.target.selectedOptions).map((s) => {
        return s.value;
      })
    );
  };

  const imageFileChangeHandler = (e) => {
    setActualFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const pdfFileHandler = (e) => {
    setPdffile(e.target.files[0]);
    setPdfName(e.target.files[0].name);
  };

  useEffect(() => {
    if (!user.admin) {
      navigate("/");
    }
  }, [user.admin]);

  useEffect(() => {
    const getPrograms = async () => {
      try {
        const response = await axios.get("/api/program/all");

        setAllPrograms(response.data);
        setSelectedProgram(response.data[0].programCode);
      } catch (error) {
        console.log(error);
      }
    };

    getPrograms();
  }, []);
  return (
    <div className="createSubject">
      <div className="subjectMiddle">
        <form action="" onSubmit={submitHandler}>
          <div className="top">
            <Link to="/create-subject" style={{ marginRight: "10px" }}>
              <Button variant="contained" color="primary" size="small">
                Create a Subject
              </Button>
            </Link>
            <Link to="/edit-subject">
              <Button size="small">Edit a Subject</Button>
            </Link>
          </div>
          <div className="formInput">
            <label htmlFor="">Name of the subject</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="formInput">
            <label htmlFor="">Subject Code</label>
            <input
              type="text"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
            />
          </div>
          <div className="formInput">
            <label htmlFor="">Under which Program?</label>
            <select
              multiple
              // size="8"
              name=""
              id=""
              onChange={(e) => handleSelectedProgram(e)}
            >
              {allPrograms.map((p) => {
                return (
                  <option value={p.programCode} key={p.programCode}>
                    {p.name}-{p.programCode}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="formInput">
            <label htmlFor="">Semester</label>
            <input
              type="number"
              value={parseInt(semester)}
              onChange={(e) => setSemester(e.target.value.toString())}
            />
          </div>

          <div className="formInput">
            <label
              htmlFor="imgFile"
              style={{ cursor: "pointer" }}
              className="selectImage"
            >
              Add Image
              <PhotoCameraIcon />
              <input
                type="file"
                id="imgFile"
                style={{ display: "none" }}
                onChange={(e) => imageFileChangeHandler(e)}
              />
              <span style={{ marginLeft: "10px" }}>
                {fileName &&
                  fileName.slice(0, 10) + "." + fileName.split(".")[1]}
              </span>
            </label>
          </div>
          <div className="formInput" style={{ marginTop: "10px" }}>
            <label
              htmlFor="pdf"
              style={{ cursor: "pointer" }}
              className="selectImage"
            >
              Add Pdf
              <CloudUploadIcon />
              <input
                type="file"
                id="pdf"
                style={{ display: "none" }}
                onChange={(e) => pdfFileHandler(e)}
              />
              <span style={{ marginLeft: "10px" }}>
                {pdfName && pdfName.slice(0, 10) + "." + pdfName.split(".")[1]}
              </span>
            </label>
          </div>
          <div className="formInput">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubject;
