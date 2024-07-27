import React from "react";
import { Link,useNavigate } from "react-router-dom";
import "./Semester.scss";

const Semester = ({ semester, number }) => {
    const navigate = useNavigate()
    return (
        // <div className="semester">
        //     <div className="semesterContainer">
        //         <h3>Semester {number}</h3>
        //         <div className="subjectContainer">
        //             {semester.map((sub) => {
        //                 return (
        //                     <Link
        //                         to={`/subjects/${sub.subjectCode}`}
        //                         style={{
        //                             textDecoration: "none",
        //                             color: "black",
        //                         }}
        //                     >
        //                         <div className="item">
        //                             <p>
        //                                 <b>Subject</b> : {sub?.name}
        //                             </p>
        //                             <p>
        //                                 <b>Subject Code</b> : {sub?.subjectCode}
        //                             </p>
        //                         </div>
        //                     </Link>
        //                 );
        //             })}
        //         </div>
        //     </div>
        // </div>

        <div className="semester">
            <div className="semesterContainer">
                <h3>Semester {number}</h3>
                <div className="subjectContainer">
                    <table>
                        <tr>
                            <th className='sn'>SN</th>
                            <th>Subject</th>
                            <th>Subject Code</th>

                        </tr>
                        {semester.map((sub,i=1)=>{
                            return(
                                
                                <tr id='subRow' onClick={()=>{
                                    navigate(`/subjects/${sub.subjectCode}`)

                                }}>
                                    <td className='sn'>{i}</td>
                                    <td>{sub.name}</td>
                                    <td>{sub.subjectCode}</td>
                                    
                                    
                                </tr>
                                
                                
                            );
                        })}
                    </table>
                </div>
            </div>
        </div>

        
    );
};

export default Semester;

