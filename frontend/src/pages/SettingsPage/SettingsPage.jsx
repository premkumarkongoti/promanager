import React from "react";
import SideNav from "../../components/Sidebar/Sidebar";
import SettingsComp from "../../components/Settings/Settings";

function SettingsPage() {
  return ( 
    <div style={{ display: "flex" }}>
      <SideNav />
      <SettingsComp />
    </div>
  );
}

export default SettingsPage;
