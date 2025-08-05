import React, { useEffect, useRef } from "react";

const UseCasesDashboard = () => {
  const listcontent = useRef(null);
  useEffect(() => {
    window.scrollTo({
        top: listcontent.current.offsetTop,
        behaviour: "smooth",
    });
}, []);
  return (
    <div ref={listcontent}>Coming Soon</div>
  )
}

export default UseCasesDashboard