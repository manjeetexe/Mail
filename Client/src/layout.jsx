import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigate from './page/Navigate';

const Layout = () => {
  return (
    <div className="flex">
      <Navigate />
      <div className="flex-1 p-6 ml-64"> {/* Ensure space for the sidebar */}
        <Outlet /> {/* This is where other pages will be displayed */}
      </div>
    </div>
  );
};

export default Layout;