import React from 'react';
import ConsultationOverlay from './ConsultationOverlay';
import ServiceOverlay from './ServiceOverlay';
import SearchOverlay from './SearchOverlay';
import ToastContainer from './Toast';

export default function OverlayRoot() {
  return (
    <>
      <ConsultationOverlay />
      <ServiceOverlay />
      <SearchOverlay />
      <ToastContainer />
    </>
  );
}
