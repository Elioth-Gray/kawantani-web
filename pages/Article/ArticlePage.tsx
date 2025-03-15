import React from "react";
import ArticleHeader from "./ArticleHeader";
import Footer from "@/components/footer/Footer";
import ArticleMain from "./ArticleMain";

const ArticlePage = () => {
  return (
    <>
      <ArticleHeader></ArticleHeader>
      <ArticleMain></ArticleMain>
      <Footer></Footer>
    </>
  );
};

export default ArticlePage;
