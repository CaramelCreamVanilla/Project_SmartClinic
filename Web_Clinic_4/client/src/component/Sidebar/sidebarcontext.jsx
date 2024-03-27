import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export function useSidebar() {
  return useContext(SidebarContext);
}

export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const adjustSidebarVisibility = () => {
      if (window.innerWidth < 576) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    adjustSidebarVisibility();

    window.addEventListener('resize', adjustSidebarVisibility);

    return () => window.removeEventListener('resize', adjustSidebarVisibility);
  }, []);



  useEffect(() => {
    if (isSidebarOpen) {
      // เมื่อ sidebar เปิด, ป้องกันการเลื่อนบน body
      document.body.style.overflowY = 'hidden';
      document.body.style.overflowX = 'hidden';
    } else {
      // เมื่อ sidebar ปิด, อนุญาตให้เลื่อนบน body
      document.body.style.overflowY = 'auto';
      document.body.style.overflowX = 'hidden';
    }

    // คืนค่าเมื่อ component unmount เพื่อทำความสะอาด effect
    return () => {
      document.body.style.overflowY = 'auto';
      document.body.style.overflowX = 'auto';
    };
  }, [isSidebarOpen]); 

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, setIsSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};