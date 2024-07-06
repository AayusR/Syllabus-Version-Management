import React, { useEffect, useState } from "react";
import "./EditProgram.scss";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import axios from "axios";
const EditProgram = () => {
  const [fileName, setFileName] = useState("");
  const [allPrograms, setAllPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState();
  const [programName, setProgramName] = useState("");
  const [programCode, setProgramCode] = useState("0");
  const [programFile, setProgramFile] = useState(null);

  const navigate = useNavigate();
  const imageFileChangeHandler = (e) => {
    setProgramFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

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

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      if (programFile) {
        const fileData = new FormData();
        fileData.append("img", programFile);

        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };
        const response = await axios.post(
          `/api/program/upload`,
          fileData,
          config
        );
        const response1 = await axios.put(`/api/program/${selectedProgram}`, {
          imgString: response.data,
          name: programName,
          programCode,
        });
        if (response1.status === 200) {
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="editProgram">
      <div className="middle">
        <form action="" onSubmit={submitHandler}>
          <div className="top">
            <Link to="/create-program" style={{ marginRight: "10px" }}>
              <Button color="primary" size="small">
                Create a Program
              </Button>
            </Link>
            <Link to="/edit-program">
              <Button size="small" variant="contained">
                Edit a Program
              </Button>
            </Link>
          </div>
          <div className="formInput">
            <label htmlFor="">Which Program To Change?</label>
            <select
              name=""
              id=""
              onChange={(e) => setSelectedProgram(e.target.value)}
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
            <label htmlFor="">Change Program's name</label>
            <input
              type="text"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
            />
          </div>
          <div className="formInput">
            <label htmlFor=""> Change Program's Code</label>
            <input
              type="number"
              value={parseInt(programCode)}
              onChange={(e) => setProgramCode(e.target.value.toString())}
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
              <span style={{ marginLeft: "10px" }}>{fileName}</span>
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

export default EditProgram;
