import React from "react";
import { useNavigate } from "react-router-dom";
import "./Semester.scss";

const Semester = ({ semester, number }) => {
  const navigate = useNavigate();

  return (
    <div className="semester">
      <div className="semesterContainer">
        <h3 className="semester-title">Semester {number}</h3>
        <div className="subjectContainer">
          <table>
            <thead>
              <tr>
                <th className="sn">SN</th>
                <th>Subject</th>
                <th>Subject Code</th>
              </tr>
            </thead>
            <tbody>
              {semester.map((sub, i) => (
                <tr
                  key={sub.subjectCode}
                  className="subRow"
                  onClick={() => navigate(`/subjects/${sub.subjectCode}`)}
                >
                  <td className="sn">{i + 1}</td>
                  <td>{sub.name}</td>
                  <td>{sub.subjectCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Semester;
