import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "../Register/Register.scss";
import { useNavigate } from "react-router-dom";
import { LOGIN, LOGOUT } from "../../redux/userslice";
const Login = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://b8ow8oc.bct.itclub.pp.ua/api/auth/login", {
                username,
                password,
            });

            if (response.status === 200) {
                dispatch(
                    LOGIN({
                        username: response.data.username,
                        email: response.data.email,
                        accessToken: response.data.accessToken,
                        admin: response.data.isAdmin,
                    })
                );
                setUsername("");
                setPassword("");
                setError(false);
                navigate("/");
            }
        } catch (error) {
            setError(true);
            console.log(error);
        }
    };
    useEffect(() => {
        if (user.accessToken) {
            navigate("/");
        }
    }, [user]);
    return (
        <div className="register">
            <form action="" onSubmit={loginHandler}>
                <h1>Login</h1>
                <div className="formInput">
                    <label htmlFor="">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="formInput">
                    <label htmlFor="">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <Link to="/register" style={{ textDecoration: "none" }}>
                    <p>Dont have an account? Sign Up</p>
                </Link>
                <button>Submit</button>
                <div className="errorContainer">
                    {error && (
                        <span className="error">Invalid Credentials!!</span>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Login;
