import React from "react";
import ArticleDetailHeader from "./ArticleDetailHeader";
import Footer from "@/components/footer/Footer";
import ArticleDetailMain from "./ArticleDetailMain";

const ArticleDetailPage = () => {
  return (
    <>
      <ArticleDetailHeader></ArticleDetailHeader>
      <ArticleDetailMain></ArticleDetailMain>
      <Footer></Footer>
    </>
  );
};

export default ArticleDetailPage;
