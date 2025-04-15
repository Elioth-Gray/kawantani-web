import React from "react";
import UserPlantDetailHeader from "./UserPlantDetailHeader";
import UserPlantDetailMain from "./UserPlantDetailMain";
import Footer from "@/components/footer/Footer";

const UserPlantDetailPage = () => {
  return (
    <>
      <UserPlantDetailHeader></UserPlantDetailHeader>
      <UserPlantDetailMain></UserPlantDetailMain>
      <Footer></Footer>
    </>
  );
};

export default UserPlantDetailPage;
