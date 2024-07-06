import React, { useState, useEffect } from "react";
import "../CreateSubject/CreateSubject.scss";
import { Button } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CreateSubject = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [name, setName] = useState("");
  const [subjectCode, setSubjectCode] = useState("0");
  const [actualFile, setActualFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [pdfFile, setPdffile] = useState(null);
  const [semester, setSemester] = useState("1");
  const [selectedProgram, setSelectedProgram] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("CT401");
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [openVersion, setOpenVersion] = useState(false);
  const [versionName, setVersionName] = useState("");
  const [subjVersionId, setSubjVersionId] = useState("");
  useEffect(() => {
    const getLatestVersion = async () => {
      const response = await axios.get(
        `/api/subject/get-latest-version/${selectedSubject}`
      );
      setSubjVersionId(response.data);
    };
    getLatestVersion();
  }, [selectedSubject]);
  const submitHandler = async () => {
    console.log(
      name,
      subjectCode,
      selectedProgram,
      semester,
      fileName,
      pdfName,
      selectedSubject,
      selectedProgram
    );

    if (actualFile && pdfFile) {
      console.log("HELLO1");
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

      //first mai syllabus ko lagi version-number khojera tyo specific ko change garne

      //changing latest version of pdf
      const changedPdf = await axios.put(
        `/api/subject/update-syllabus-pdf/${selectedSubject}`,
        {
          id: subjVersionId,
          pdf: response1.data,
        }
      );
      const response2 = await axios.put(`/api/subject/${selectedSubject}`, {
        imgString: response.data,
        name,
        subjectCode,
        semester,
        parentProgramCode: selectedProgram,
      });
      console.log(response2.data);
      if (response2.status === 200) {
        navigate("/");
      }
    } else if (pdfFile) {
      console.log("HELLO2");
      const pdfData = new FormData();
      pdfData.append("file", pdfFile);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      const response1 = await axios.post(
        "/api/subject/upload-file",
        pdfData,
        config
      );

      const changedPdf = await axios.put(
        `/api/subject/update-syllabus-pdf/${selectedSubject}`,
        {
          id: subjVersionId,
          pdf: response1.data,
        }
      );
      const response2 = await axios.put(`/api/subject/${selectedSubject}`, {
        name,
        subjectCode,
        semester,
        parentProgramCode: selectedProgram,
      });
      console.log(response2.data);
      if (response2.status === 200) {
        navigate("/");
      }
    } else if (actualFile) {
      console.log("HELLO3");
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

      const response2 = await axios.put(`/api/subject/${selectedSubject}`, {
        imgString: response.data,
        name,
        subjectCode,
        semester,
        parentProgramCode: selectedProgram,
      });
      console.log(response2.data);
      if (response2.status === 200) {
        navigate("/");
      }
    } else {
      console.log("HELLO4");
      const response2 = await axios.put(`/api/subject/${selectedSubject}`, {
        name,
        subjectCode,
        semester,
        parentProgramCode: selectedProgram,
      });

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

  useEffect(() => {
    const getAllSubjects = async () => {
      const response = await axios.get("/api/subject/all");
      setAllSubjects(response.data);
      setSelectedSubject(response.data[0].subjectCode);
    };
    getAllSubjects();
  }, []);

  useEffect(() => {
    const getSingleSubject = async () => {
      const response = await axios.get(`/api/subject/${selectedSubject}`);
      console.log("Single Subject Data is", response.data);
      setName(response.data.name);
      setSubjectCode(response.data.subjectCode);
      setSemester(response.data.semester);
      setSelectedProgram(response.data.parentProgramCode);
    };
    getSingleSubject();
  }, [selectedSubject]);

  const versionSubmitHandler = async (e) => {
    setOpen(false);
    e.preventDefault();
    if (pdfFile) {
      const pdfData = new FormData();
      pdfData.append("file", pdfFile);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      const response = await axios.post(
        `/api/subject/upload-file`,
        pdfData,
        config
      );

      setPdffile(null);
      setPdfName("");
      const response1 = await axios.put(
        `/api/subject/new-version/${selectedSubject}`,
        {
          syllabus: {
            pdf: response.data,
            version: versionName,
          },
        }
      );
      console.log(response1.data);
      if (response1.status === 200) {
        setOpen(false);
        navigate("/");
      }
      // submitHandler();
    }
  };

  return (
    <div className="createSubject">
      <div className="subjectMiddle">
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="top">
            <Link to="/create-subject" style={{ marginRight: "10px" }}>
              <Button color="primary" size="small">
                Create a Subject
              </Button>
            </Link>
            <Link to="/edit-subject">
              <Button size="small" variant="contained">
                Edit a Subject
              </Button>
            </Link>
          </div>
          <div className="formInput">
            <label htmlFor="">Which Subject to be edited?</label>
            <select
              // size="8"
              value={selectedSubject}
              name=""
              id=""
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {allSubjects.map((p) => {
                return (
                  <option value={p.subjectCode} key={p.subjectCode}>
                    {p.name}-{p.subjectCode}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="formInput">
            <label htmlFor="">Edit Name of the subject</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="formInput">
            <label htmlFor="">Edit Subject Code</label>
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
            <label htmlFor="">Edit Semester</label>
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
              Change Image
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
              Change Pdf
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
            <button type="submit" onClick={handleOpen}>
              Submit
            </button>
          </div>
        </form>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{ textAlign: "center" }}
          >
            Create A New Version
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              padding: "10px",
            }}
          >
            {openVersion && (
              <div className="openVersion">
                <input
                  type="text"
                  value={versionName}
                  placeholder="Name of the new version"
                  onChange={(e) => setVersionName(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => versionSubmitHandler(e)}
                >
                  Submit
                </Button>
              </div>
            )}

            {!openVersion && (
              <Button
                variant="contained"
                color="success"
                onClick={(e) => setOpenVersion(true)}
              >
                Yes
              </Button>
            )}
            {!openVersion && (
              <Button
                variant="contained"
                color="error"
                onClick={(e) => submitHandler(e)}
              >
                No
              </Button>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateSubject;
