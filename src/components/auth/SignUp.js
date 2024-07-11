import { Link, useNavigate } from "react-router-dom";
import "./signup.css";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { MdHome } from "react-icons/md";
import { toast } from "react-toastify";
const SignUp = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const [users, setUsers] = useState([
    { userName: "existingUser1", email: "user1@example.com" },
    { userName: "existingUser2", email: "user2@example.com" },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const checkUsername = (username) => {
    const userExists = users.some((user) => user.userName === username);
    return !userExists;
  };

  const submit = async (data) => {
    console.log(data);

    if (!checkUsername(data.userName)) {
      setError("userName", {
        type: "manual",
        message: "Tên người dùng đã tồn tại",
      });
      return;
    }

    data.role = "user";
    setUsers([
      ...users,
      {
        userName: data.userName,
        password: data.password,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
      },
    ]);

    await fetch("http://localhost:9999/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    toast.success("Đăng ký thành công!");
    navigate("/login");
  };

  const sectionStyle = {
    backgroundImage: `url("https://scr.vn/wp-content/uploads/2020/07/Si%C3%AAu-xe-Mc-Laren-4k-ch%E1%BA%A5t-ch%C6%A1i-scaled-2048x1152.jpg")`,
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
          <div className="col-md-6">
            <div className="header">
              <h1 style={{ color: "wheat" }}>Register form</h1>
            </div>
            <div className="data">
              <form className="" onSubmit={handleSubmit(submit)}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="User Name"
                    className="form-control"
                    name="userName"
                    {...register("userName", {
                      required: "Tên người dùng không được để trống",
                      validate: (value) =>
                        checkUsername(value) || "Tên người dùng đã tồn tại",
                    })}
                  />
                  {errors.userName && (
                    <p className="text-danger">{errors.userName.message}</p>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Password"
                    className="form-control"
                    name="password"
                    {...register("password", {
                      required: "Mật khẩu không được để trống",
                      minLength: {
                        value: 6,
                        message: "Tối thiểu 6 kí tự",
                      },
                      maxLength: {
                        value: 20,
                        message: "Tối đa 20 kí tự",
                      },
                    })}
                  />
                  {errors.password && (
                    <p className="text-danger">{errors.password.message}</p>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Email"
                    className="form-control"
                    name="email"
                    {...register("email", {
                      required: "Email không được để trống",
                      pattern: {
                        value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                        message: "Không đúng định dạng",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-danger">{errors.email.message}</p>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="form-control"
                    maxLength="11"
                    name="phoneNumber"
                    {...register("phoneNumber", {
                      required: true,
                      pattern: {
                        value: /^(?:\+84|84|0)(?:3|5|7|8|9)(?:[0-9]{8})$/,
                        message: "Không đúng định dạng",
                      },
                      minLength: {
                        value: 10,
                        message: "Tối thiểu 10 số",
                      },
                    })}
                  />
                  {errors.phoneNumber && (
                    <p className="text-danger">{errors.phoneNumber.message}</p>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Address"
                    className="form-control"
                    name="address"
                    {...register("address", {
                      required: "Địa chỉ không được để trống",
                    })}
                  />
                  {errors.address && (
                    <p className="text-danger">{errors.address.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <div className="d-flex justify-content-center row">
                    <button style={{ marginBottom: "10px" }} className="btn btn-outline-light mr-2 col-md-5 login">
                      <Link style={{ textDecoration: "none", color: "wheat" }} to="/login">Login</Link>
                    </button>
                    <button style={{ marginBottom: "10px" }} className="btn btn-dark col-md-5 signup" >
                      Signup
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="sign-in">

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
