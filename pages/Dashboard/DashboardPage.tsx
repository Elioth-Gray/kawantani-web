import React from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardMain from "./DashboardMain";
import Footer from "@/components/footer/Footer";

const DashboardPage = () => {
  return (
    <>
      <DashboardHeader />
      <DashboardMain></DashboardMain>
      <Footer></Footer>
    </>
  );
};

export default DashboardPage;
