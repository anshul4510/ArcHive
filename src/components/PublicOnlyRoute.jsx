import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SpinnerHex from './SpinnerHex';

const PublicOnlyRoute = ({ children, redirectTo = '/projects' }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <SpinnerHex fullPage={true} />;
  }

  if (isAuthenticated) {
    const from = location.state?.from || redirectTo;
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicOnlyRoute;
