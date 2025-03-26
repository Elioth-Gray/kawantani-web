import React from "react";
import DashboardArticleHeader from "./DashboardArticleHeader";
import DashboardArticleMain from "./DashboardArticleMain";
import Footer from "@/components/footer/Footer";

const DashboardArticlePage = () => {
  return (
    <>
      <DashboardArticleHeader></DashboardArticleHeader>
      <DashboardArticleMain></DashboardArticleMain>
      <Footer></Footer>
    </>
  );
};

export default DashboardArticlePage;
