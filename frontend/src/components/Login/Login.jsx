import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import emailSVG from "../../assets/icons/emailSVG.svg";
import eye from "../../assets/icons/eye.svg";
import lock from "../../assets/icons/lock.svg";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../apis/auth";
import styles from "./Login.module.css";
import LoadingMessage from "../LoadingMessage/LoadingMessage";

function Login() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    let valid = true;

    // Check if email is available
    if (!(userData.email.trim().length > 0)) {
      valid = false;
      setEmailError(true);
    } else {
      setEmailError(false);
    }

    // Check if password is available
    if (!(userData.password.trim().length > 0)) {
      valid = false;
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    // Submit the form if it is valid
    if (valid) {
      setIsLoading(true);
      try {
        const response = await loginUser({ ...userData });

        if (response?.success) {
          localStorage.setItem("tokenPro", response.token);
          localStorage.setItem("usernamePro", response.username);
          toast.success(response.message);
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else if (response?.success === false) {
          toast.error(response?.message);
        } else {
          toast.error("Server is not responding!");
        }
      } catch (error) {
        console.error("Error logging in:", error);
        toast.error("Error logging in. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <p className={styles.loginHeading}>Login</p>
      <div className={styles.loginForm}>
        <div className={styles.inputGroup}>
          <img src={emailSVG} alt="icon" className={styles.icon} />
          <input
            className={styles.inputField}
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
        </div>
        {emailError && <p className={styles.errorMessage}>Email is required</p>}
        <div className={styles.inputGroup}>
          <div className={styles.passwordGroup}>
            <img src={lock} alt="icon" className={styles.icon} />
            <input
              className={styles.inputField}
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
            className={styles.togglePassword}
          />
        </div>
        {passwordError && (
          <p className={styles.errorMessage}>Password is required</p>
        )}
      </div>
      <div className={styles.loginFooter}>
        <button
          disabled={isLoading}
          onClick={handleSubmit}
          className={`${styles.loginButton} ${styles.button}`}
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>
        <p>Don't have an account yet?</p>
        <button
          disabled={isLoading}
          className={`${styles.registerButton} ${styles.button}`}
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
      {isLoading && <LoadingMessage />}
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

export default Login;




























