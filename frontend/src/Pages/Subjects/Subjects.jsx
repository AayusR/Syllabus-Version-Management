import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./Subjects.scss";
import Semester from "../../Components/Semester/Semester";
import { useSelector } from "react-redux";

const Subjects = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [semester1, setSemester1] = useState([]);
  const [semester2, setSemester2] = useState([]);
  // console.log(semester1, semester2);

  let urlParams = useParams();
  // console.log(urlParams.programCode);

  useEffect(() => {
    if (!user.accessToken) {
      navigate("/login");
    }
  }, [user.accessToken]);
  useEffect(() => {
    // console.log("UseEffect ran");
    const fetchSubject = async () => {
      const response = await axios.get(
        `/api/subject/parent/${urlParams.programCode}`
      );
      const items = response.data;
      setSemester1(items.filter((i) => i.semester === "1"));
      setSemester2(items.filter((i) => i.semester === "2"));
    };

    fetchSubject();
  }, [urlParams.programCode]);
  return (
    <div>
      <Semester semester={semester1} number={1} />
      <Semester semester={semester2} number={2} />
    </div>
  );
};

export default Subjects;
