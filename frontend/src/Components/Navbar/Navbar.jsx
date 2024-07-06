import "./Navbar.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Stack } from "@mui/material";
import { LOGOUT } from "../../redux/userslice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = () => {
    dispatch(LOGOUT());
    navigate("/login");
  };
  const user = useSelector((state) => state.user);

  return (
    <div className="navbar">
      <div className="wrapper">
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          <h1>Syllabus Management</h1>
        </Link>

        {!user.accessToken ? (
          <div className="items">
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "white" }}
            >
              <div className="item">Login</div>
            </Link>
            <Link
              to="/register"
              style={{ textDecoration: "none", color: "white" }}
            >
              <div className="item">Register</div>
            </Link>
          </div>
        ) : (
          <div className="items">
            {/* <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={logoutHandler}
            >
              Log Out
            </Button> */}
            {user.admin && (
              <Link
                to="/create-program"
                className="tags"
                style={{ textDecoration: "none", color: "white" }}
              >
                Update Program
              </Link>
            )}

            {user.admin && (
              <Link
                to="/create-subject"
                className="tags"
                style={{ textDecoration: "none", color: "white" }}
              >
                Update Subject
              </Link>
            )}
            {/* <p className="tags">Edit Profile</p> */}
            <p className="tags" onClick={logoutHandler}>
              LogOut
            </p>
            <div className="item">
              <div className="item-img">
                <img
                  src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                  alt=""
                  className="avatar"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
