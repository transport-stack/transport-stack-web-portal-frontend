import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const DataServiceNavigation = () => {
    const { path, status } = useSelector((state) => state.verify.dataServiceLogin);
  return (
    <div>{status?<Navigate to={path} />:<Navigate to={"/"} />}</div>
  )
}

export default DataServiceNavigation