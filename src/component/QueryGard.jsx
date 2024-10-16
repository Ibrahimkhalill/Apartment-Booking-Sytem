import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const QueryGuard = ({ children, requiredParams }) => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  
  // Check if required query parameters are present
  const allParamsPresent = requiredParams.every(param => urlParams.has(param));

  // If required parameters are missing, redirect to the desired route (e.g., home)
  if (!allParamsPresent) {
    return <Navigate to="*" />;
  }

  return children; // If all required params are present, render the children components
};

export default QueryGuard;
