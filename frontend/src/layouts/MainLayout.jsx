import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col">
      {children}
    </div>
  );
};

export default MainLayout;
