import React from "react";
import DashboardWorkshopHeader from "./DashboardWorkshopHeader";
import DashboardWorkshopMain from "./DashboardWorkshopMain";
import Footer from "@/components/footer/Footer";

const DashboardWorkshopPage = () => {
  return (
    <>
      <DashboardWorkshopHeader></DashboardWorkshopHeader>
      <DashboardWorkshopMain></DashboardWorkshopMain>
      <Footer></Footer>
    </>
  );
};

export default DashboardWorkshopPage;
