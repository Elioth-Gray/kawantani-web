import React from "react";
import HomeHeader from "@/pages/Home/HomeHeader";
import HomeMain from "@/pages/Home/HomeMain";
import Footer from "@/components/footer/Footer";

const HomePage = () => {
  return (
    <>
      {/* Header Section */}
      <HomeHeader></HomeHeader>
      {/* Main Section */}
      <HomeMain></HomeMain>
      {/* Footer Section */}
      <Footer></Footer>
    </>
  );
};

export default HomePage;
