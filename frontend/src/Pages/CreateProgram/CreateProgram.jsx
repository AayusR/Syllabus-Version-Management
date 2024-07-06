import { Button } from "@mui/material";
import React, { useState } from "react";
import "./CreateProgram.scss";
import { Link, useNavigate } from "react-router-dom";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import axios from "axios";

const CreateProgram = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [programCode, setProgramCode] = useState("0");
  const [fileName, setFileName] = useState("");
  const [actualFile, setActualFile] = useState(null);
  const imageFileChangeHandler = (e) => {
    setActualFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const fileData = new FormData();
      if (actualFile) {
        fileData.append("img", actualFile);
      }

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      const response = await axios.post(
        "/api/program/upload",
        fileData,
        config
      );

      const response1 = await axios.post("/api/program/create", {
        name,
        programCode,
        imgString: response.data,
      });
      if (response1.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="createProgram">
      <div className="middle">
        <form action="" onSubmit={submitHandler}>
          <div className="top">
            <Link to="/create-program" style={{ marginRight: "10px" }}>
              <Button variant="contained" color="primary" size="small">
                Create a Program
              </Button>
            </Link>
            <Link to="/edit-program">
              <Button size="small">Edit a Program</Button>
            </Link>
          </div>
          <div className="formInput">
            <label htmlFor="">Name of the program</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="formInput">
            <label htmlFor="">Program Code</label>
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
          <div className="formInput">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProgram;
