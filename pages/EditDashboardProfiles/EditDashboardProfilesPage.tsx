import React from "react";
import Footer from "@/components/footer/Footer";
import EditDashboardProfileHeader from "./EditDahboardProfilesHeader";
import EditDashboardProfileMain from "./EditDashboardProfilesMain";

const EditDashboardProfilePage = () => {
    return (
        <>
            <EditDashboardProfileHeader></EditDashboardProfileHeader>
            <EditDashboardProfileMain></EditDashboardProfileMain>
            <Footer></Footer>
        </>
    )
}

export default EditDashboardProfilePage;