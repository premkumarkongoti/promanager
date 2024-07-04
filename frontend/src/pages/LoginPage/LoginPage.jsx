import React from "react";
import Login from "../../components/Login/Login";
import CoverImage from "../../components/Cover/Cover";
function LoginPage() {
  return ( 
    <div style={{ display: "flex", height: "100vh" }}>
      <CoverImage />
      <Login />
    </div>
  );
}

export default LoginPage;
