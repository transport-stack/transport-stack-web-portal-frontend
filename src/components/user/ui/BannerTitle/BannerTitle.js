import useCheckMobileScreen from "../../../../hooks/useCheckMobileScreen";
import arrow from "../../../../assets/images/left-arrow.png";
import "./BannerTitle.scss";
import { useNavigate } from 'react-router-dom';

const BannerTitle = ({ title='' }) => {
  const navigate = useNavigate();
  const isMobile = useCheckMobileScreen();
  return (
    <div className="banner_title d-flex align-items-center">
      {isMobile ? (
        <img src={arrow} alt="left arrow" className="left-arrow" onClick={() => navigate(-1)}/>
      ) : null}
      <h1>{title}</h1>
    </div>
  );
};

export default BannerTitle;
