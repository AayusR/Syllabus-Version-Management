import React from "react";
import { Link } from "react-router-dom";
import "./Semester.scss";

const Semester = ({ semester, number }) => {
  return (
    <div className="semester">
      <div className="semesterContainer">
        <h3>Semester {number}</h3>
        <div className="subjectContainer">
          {semester.map((sub) => {
            return (
              <Link
                to={`/subjects/${sub.subjectCode}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className="item">
                  <img src={`/subject-image/${sub?.imgString}`} alt="" />
                  <p>
                    <b>Subject</b> : {sub?.name}
                  </p>
                  <p>
                    <b>Subject Code</b> : {sub?.subjectCode}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Semester;
// style={{ textDecoration: "none", color: "black" }}
// target="_blank"
// href={`http://localhost:4000/subject-pdf/${sub.syllabus}`}
// key={sub?._id}
