import React from "react";
import DashboardPlantsHeader from "./DashboardPlantsHeader";
import DashboardPlantsMain from "./DashboardPlantsMain";
import Footer from "@/components/footer/Footer";

const DashboardPlantsPage = () => {
  return (
    <>
      <DashboardPlantsHeader></DashboardPlantsHeader>
      <DashboardPlantsMain></DashboardPlantsMain>
      <Footer></Footer>
    </>
  );
};

export default DashboardPlantsPage;
