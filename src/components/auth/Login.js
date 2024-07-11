import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdHome } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

const Login = ({ setLogin }) => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:9999/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const onSubmit = (data) => {
    const user = users.find(
      (user) =>
        user.userName === data.userName && user.password === data.password
    );

    localStorage.setItem("loggedInUser", JSON.stringify(user));

    if (user) {
      if (user.role === "user") {
        navigate("/home");
      } else if (user.role === "admin") {
        setLogin(true)
        navigate('/admin')
      }
    } else {
      alert("Invalid username or password");
    }
  };

  const sectionStyle = {
    backgroundImage: `url("https://thienthanhlimo.com/wp-content/uploads/2022/05/101-anh-sieu-xe-4k-tai-free-lam-hinh-nen-dt-may-tinh-5.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div style={sectionStyle}>
      <div className="back-to-home">
        <Link to="/">
          <MdHome />   Home
        </Link>
      </div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6"></div>

          <div className="  col-md-6" style={{ border: "5px" }}>
            <div className="header">
              <h1 style={{ color: "wheat" }}>Login form</h1>
            </div>
            <div className="data w-100">
              <form
                id="form"
                className="form"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="User Name"
                    className="form-control"
                    id="userName"
                    {...register("userName", { required: true })}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Password"
                    className="form-control"
                    id="password"
                    {...register("password", { required: true })}
                  />
                </div>
                {error && <div className="error">{error}</div>}
                <div className="form-group">
                  <div className="d-flex justify-content-center row">
                    <button className="btn btn-dark mr-2 col-md-5 login " style={{ marginBottom: "10px" }}>
                      Login
                    </button>
                    <button style={{ marginBottom: "10px" }} className="btn btn-outline-light col-md-5 signup">
                      <Link
                        to="/signup"
                        style={{ textDecoration: "none", color: "wheat" }}
                      >
                        Signup
                      </Link>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
