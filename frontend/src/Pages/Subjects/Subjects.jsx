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
    const [semester3, setSemester3] = useState([]);
    const [semester4, setSemester4] = useState([]);
    const [semester5, setSemester5] = useState([]);
    const [semester6, setSemester6] = useState([]);
    const [semester7, setSemester7] = useState([]);
    const [semester8, setSemester8] = useState([]);
    // console.log(semester1, semester2);

    let urlParams = useParams();
    // console.log(urlParams.programCode);

    useEffect(() => {
        // if (!user.accessToken) {
        //     navigate("/login");
        // }
    }, [user.accessToken]);
    useEffect(() => {
        // console.log("UseEffect ran");
        const fetchSubject = async () => {
            const response = await axios.get(
                `http://b8ow8oc.bct.itclub.pp.ua/api/subject/parent/${urlParams.programCode}`
            );
            const items = response.data;
            setSemester1(items.filter((i) => i.semester === "1"));
            setSemester2(items.filter((i) => i.semester === "2"));
            setSemester3(items.filter((i) => i.semester === "3"));
            setSemester4(items.filter((i) => i.semester === "4"));
            setSemester5(items.filter((i) => i.semester === "5"));
            setSemester6(items.filter((i) => i.semester === "6"));
            setSemester7(items.filter((i) => i.semester === "7"));
            setSemester8(items.filter((i) => i.semester === "8"));
        };

        fetchSubject();
    }, [urlParams.programCode]);
    return (
        <div>
            <Semester semester={semester1} number={1} />
            <Semester semester={semester2} number={2} />
            <Semester semester={semester3} number={3} />
            <Semester semester={semester4} number={4} />
            <Semester semester={semester5} number={5} />
            <Semester semester={semester6} number={6} />
            <Semester semester={semester7} number={7} />
            <Semester semester={semester8} number={8} />
        </div>
    );
};

export default Subjects;
