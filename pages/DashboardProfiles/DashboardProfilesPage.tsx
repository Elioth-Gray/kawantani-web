import React from "react";
import Footer from "@/components/footer/Footer";
import DashboardProfilesHeader from "./DashboardProfilesHeader";
import DashboardProfilesMain from "./DashboardProfilesMain";

const DashboardProfilesPage = () => {
    return (
        <>
            <DashboardProfilesHeader></DashboardProfilesHeader>
            <DashboardProfilesMain></DashboardProfilesMain>
            <Footer></Footer>
        </>
    )
}

export default DashboardProfilesPage;