import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MySubscriptionOrRequest from "./MySubscriptionOrRequest";

const MySubscriptionAndRequestBase = () => {
  const location = useLocation();
  const [isPath, setIsPath] = useState(null);
  
  useEffect(() => {
    if (location) {
      const n = location.pathname.lastIndexOf("/");
      const result = location.pathname.substring(n + 1);
      setIsPath(result);
    }
  }, [location]);

  return (
    <>
      {isPath !== null && isPath === "mysubscriptions" ? (
        <MySubscriptionOrRequest label="My Subscriptions" path={isPath} />
      ) : (
        <MySubscriptionOrRequest label="My Requests" path={isPath} />
      )}
    </>
  );
};
export default MySubscriptionAndRequestBase;
