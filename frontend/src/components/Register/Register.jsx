import React, { useState } from "react";
import Styles from "./Register.module.css";
import nameSVG from "../../assets/icons/nameSVG.svg";
import emailSVG from "../../assets/icons/emailSVG.svg";
import eye from "../../assets/icons/eye.svg";
import lock from "../../assets/icons/lock.svg";
import { registerUser } from "../../apis/auth";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Register() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfPasswordVisible, setIsConfPasswordVisible] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    let valid = true;

    if (!(userData.name.trim().length > 0)) {
      valid = false;
      setNameError(true);
    } else {
      setNameError(false);
    }

    if (!(userData.email.trim().length > 0)) {
      valid = false;
      setEmailError(true);
    } else {
      setEmailError(false);
    }

    if (!(userData.password.trim().length > 0)) {
      valid = false;
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    if (userData.password !== userData.confirmPassword) {
      valid = false;
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }

    if (valid) {
      const data = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      };
      const response = await registerUser(data);

      if (response?.success) {
        localStorage.setItem("tokenPro", response.token);
        localStorage.setItem("usernamePro", response.username);
        toast.success(response.message);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else if (response?.success === false) {
        toast.error(response?.message);
      } else {
        toast.error("Server is not responding!");
      }
    }
  };

  return (
    <div className={Styles.registrationSection}>
      <p className={Styles.heading}>Register</p>
      <div className={Styles.form}>
        <div className={Styles.inputWrapper}>
          <img src={nameSVG} alt="icon" className={Styles.icon} />
          <input
            className={Styles.inputBox}
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
          />
        </div>
        {nameError ? <p className={Styles.error}>Field is required</p> : <></>}
        <div className={Styles.inputWrapper}>
          <img src={emailSVG} alt="icon" className={Styles.icon} />
          <input
            className={Styles.inputBox}
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
        </div>
        {emailError ? <p className={Styles.error}>Field is required</p> : <></>}
        <div className={Styles.inputWrapper}>
          <div className={Styles.nestedInputWrapper}>
            <img src={lock} alt="icon" className={Styles.icon} />
            <input
              className={Styles.inputBox}
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
          </div>
          <img
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            src={eye}
            alt="icon"
            className={Styles.eyeButton}
          />
        </div>
        {passwordError ? <p className={Styles.error}>Field is required</p> : <></>}
        <div className={Styles.inputWrapper}>
          <div className={Styles.nestedInputWrapper}>
            <img src={lock} alt="icon" className={Styles.icon} />
            <input
              className={Styles.inputBox}
              type={isConfPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
            />
          </div>
          <img
            onClick={() => setIsConfPasswordVisible(!isConfPasswordVisible)}
            src={eye}
            alt="icon"
            className={Styles.eyeButton}
          />
        </div>
        {confirmPasswordError ? (
          <p className={Styles.error}>Passwords do NOT match!</p>
        ) : (
          <></>
        )}
      </div>
      <div className={Styles.footer}>
        <button
          className={`${Styles.registerButton} ${Styles.button}`}
          onClick={handleSubmit}
        >
          Register
        </button>
        <p>Have an account?</p>
        <button
          onClick={() => navigate("/login")}
          className={`${Styles.loginButton} ${Styles.button}`}
        >
          Log in
        </button>
      </div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: {
            style: {
              fontSize: "1.5rem",
              height: "2rem",
            },
          },
          error: {
            style: {
              fontSize: "1.5rem",
              height: "2rem",
            },
          },
        }}
      />
    </div>
  );
}

export default Register;





































