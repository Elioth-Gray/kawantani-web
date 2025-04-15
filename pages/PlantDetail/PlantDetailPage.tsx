import React from "react";
import PlantDetailHeader from "@/pages/PlantDetail/PlantDetailHeader";
import PlantDetailMain from "./PlantDetailMain";
import Footer from "@/components/footer/Footer";

const PlantDetailPage = () => {
  return (
    <>
      <PlantDetailHeader></PlantDetailHeader>
      <PlantDetailMain></PlantDetailMain>
      <Footer></Footer>
    </>
  );
};

export default PlantDetailPage;
