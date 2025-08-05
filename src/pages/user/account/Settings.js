import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import "../../../assets/styles/accountSetting.scss";

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile: { id }, accessToken } = useSelector((state) => state.auth.user);
  const { switchStatus } = useSelector((state) => state.notifications);
  
  useEffect(() => {
    const data = {
      id: id,
      accessToken: accessToken
    }
    dispatch({ type: 'fetchNotificationSwitchStatus', payload: data });
  }, []);
  
  const changeSwitchStatus = () => {
    const data = {
      id: id,
      accessToken: accessToken,
      switchState:!switchStatus
    }
    dispatch({ type: 'changeNotificationSwitchStatus', payload: data });
  };

  return (
    <div className="container setting">
      <h1 className="setting_title">Settings</h1>
      <div className="d-flex flex-column">
        <ButtonComponent type="primaryBlue setting_btn">
          Notifications On
          <label className="switch">
            <input
              type="checkbox"
              checked={switchStatus}
              onChange={() => changeSwitchStatus()}
            />
            <span className="slider round"></span>
          </label>
        </ButtonComponent>
        <ButtonComponent
          type="primaryBlue"
          onClick={() => navigate("/changepassword")}
        >
          Change Password
        </ButtonComponent>
      </div>
    </div>
  );
};

export default Settings;
