import React from "react";
import WorkshopRegistrarionHeader from "./WorkshopRegistrarionHeader";
import WorkshopRegistrationMain from "./WorkshopRegistrationMain";
import Footer from "@/components/footer/Footer";

const WorkshopRegistrationPage = () => {
  return (
    <>
      <WorkshopRegistrarionHeader></WorkshopRegistrarionHeader>
      <WorkshopRegistrationMain></WorkshopRegistrationMain>
      <Footer></Footer>
    </>
  );
};

export default WorkshopRegistrationPage;
