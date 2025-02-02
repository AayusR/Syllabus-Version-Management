import "./Navbar.scss";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@mui/material";
import { LOGOUT } from "../../redux/userslice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const logoutHandler = () => {
    dispatch(LOGOUT());
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="wrapper">
        <Link to="/" className="logo">
          Syllabus Management
        </Link>

        <div className="nav-items">
          {!user.accessToken ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
            </>
          ) : (
            <>
              {user.admin && (
                <>
                  <Link to="/create-program" className="nav-link">Update Program</Link>
                  <Link to="/create-subject" className="nav-link">Update Subject</Link>
                </>
              )}
              <p className="nav-link logout" onClick={logoutHandler}>Log Out</p>
              <div className="avatar-container">
                <img
                  src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                  alt="Profile"
                  className="avatar"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
