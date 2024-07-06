import React, { useEffect, useState } from "react";
import "./Versions.scss";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const Versions = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [item, setItem] = useState({});
  let urlParams = useParams();

  useEffect(() => {
    if (!user.accessToken) {
      navigate("/login");
    }
  }, [user.accessToken]);

  useEffect(() => {
    const getSubject = async () => {
      try {
        const response = await axios.get(
          `/api/subject/${urlParams?.subjectCode}`
        );
        setItem(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getSubject();
  }, [urlParams.subjectCode]);
  return (
    <div className="versions">
      <h1>Versions</h1>
      <table>
        <tr>
          <th>File Name</th>
          <th>Version Name</th>
          <th>Open the Files</th>
        </tr>
        {item?.syllabus?.map((i) => {
          return (
            <tr>
              <td>{i.pdf}</td>
              <td>{i.version}</td>
              <td>
                {" "}
                <a
                  key={i.pdf}
                  target="_blank"
                  href={`http://localhost:4000/subject-pdf/${i.pdf}`}
                >
                  Click To Open
                </a>
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default Versions;
