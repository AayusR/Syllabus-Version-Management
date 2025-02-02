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

    // useEffect(() => {
    //     // if (!user.accessToken) {
    //     //   navigate("/login");
    //     // }
    // }, [user.accessToken]);

    useEffect(() => {
        const getSubject = async () => {
            try {
                const response = await axios.get(
                    `https://b8ow8oc.bct.itclub.pp.ua/api/subject/${urlParams?.subjectCode}`
                );
                setItem(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        getSubject();
    }, [urlParams.subjectCode]);

    const handleDelete = async (pdfName) => {
        try {
            // Make an API call to delete the version
            await axios.delete(
                `https://b8ow8oc.bct.itclub.pp.ua/api/subject/${urlParams?.subjectCode}/version/${pdfName}`
            );

            // Update the state to remove the deleted item from the syllabus
            setItem((prevState) => ({
                ...prevState,
                syllabus: prevState.syllabus.filter((i) => i.pdf !== pdfName),
            }));
        } catch (error) {
            console.log("Error deleting version:", error);
        }
    };

    return (
        <div className="versions">
            <h1>Versions</h1>
            <p id="subName">{item.name}</p>
            <table>
                <tr>
                    <th>File Name</th>
                    <th>Version Name</th>
                    <th>Open the Files</th>
                    {user.admin && <th>Action</th>}
                </tr>
                {item?.syllabus?.map((i) => {
                    return (
                        <tr key={i.pdf}>
                            <td>{i.pdf}</td>
                            <td>{i.version}</td>
                            <td>
                                <a
                                    key={i.pdf}
                                    target="_blank"
                                    href={`https://b8ow8oc.bct.itclub.pp.ua/subject-pdf/${i.pdf}`}
                                >
                                    Click To Open
                                </a>
                            </td>
                            {user.admin && (
                                <td>
                                    {/* Delete button */}
                                    <button onClick={() => handleDelete(i.pdf)}>
                                        Delete
                                    </button>
                                </td>
                            )}
                        </tr>
                    );
                })}
            </table>
        </div>
    );
};

export default Versions;
