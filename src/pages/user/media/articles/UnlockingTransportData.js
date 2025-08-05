import React from 'react'
import AddSeo from '../../../../utils/AddSeo'
import Breadcrumb from '../../../../components/user/ui/Breadcrumb/Breadcrumb'
import { useNavigate } from 'react-router-dom';
import '../../../../assets/styles/articles.scss';
import arrow from "../../../../assets/images/left-arrow.png";

const UnlockingTransportData = () => {
    const navigate = useNavigate();
    return (
        <div className="article-content">
            <AddSeo title="Delhi Transport Stack" description="Unlocking Transport Data: Pioneering Smart City Innovations" />
            <div className="content-header">
                <div className="container">
                    <Breadcrumb />
                    <div className="d-flex">
                        <img src={arrow} alt="left arrow" className="left-arrow" onClick={() => navigate(-1)} />
                        <h1 className="header-title">Media / Articles</h1>
                    </div>
                </div>
            </div>
            <div className="content-body">
                <div className="container d-flex flex-column align-items-center justify-content-center photo">
                   
                </div>
            </div>
        </div>
    )
}

export default UnlockingTransportData
