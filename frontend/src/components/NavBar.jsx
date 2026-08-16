import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <Link to="/feed" className="logo">
                Rmedia
            </Link>

            <div className="nav-links">
                <Link to="/feed">Home</Link>
                <Link to="/users">People</Link>
                <Link to="/profile">Profile</Link>

                <button onClick={logout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;