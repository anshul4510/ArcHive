import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const UiContext = createContext();

export const useUi = () => useContext(UiContext);

export const UiProvider = ({ children }) => {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [activeServiceOverlay, setActiveServiceOverlay] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [authPromptMessage, setAuthPromptMessage] = useState({});

  const openConsultation = () => setIsConsultationOpen(true);
  const closeConsultation = () => setIsConsultationOpen(false);

  const openService = (serviceId) => setActiveServiceOverlay(serviceId);
  const closeService = () => setActiveServiceOverlay(null);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const openAuthPrompt = (title, message) => {
    setAuthPromptMessage({ title, message });
    setIsAuthPromptOpen(true);
  };
  const closeAuthPrompt = () => setIsAuthPromptOpen(false);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <UiContext.Provider
      value={{
        isConsultationOpen, openConsultation, closeConsultation,
        activeServiceOverlay, openService, closeService,
        isSearchOpen, openSearch, closeSearch,
        isAuthPromptOpen, authPromptMessage, openAuthPrompt, closeAuthPrompt,
        toasts, addToast, removeToast
      }}
    >
      {children}
    </UiContext.Provider>
  );
};
