import React from "react";
import UserArticleDetailHeader from "./UserArticleDetailHeader";
import UserArticleDetailMain from "./UserArticleDetailMain";
import Footer from "@/components/footer/Footer";

const UserArticleDetailPage = () => {
  return (
    <>
      <UserArticleDetailHeader></UserArticleDetailHeader>
      <UserArticleDetailMain></UserArticleDetailMain>
      <Footer></Footer>
    </>
  );
};

export default UserArticleDetailPage;
