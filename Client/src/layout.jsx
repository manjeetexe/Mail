import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigate from './page/Navigate';

const Layout = () => {
  return (
    <div className="flex">
      <div className='w-64'>
      <Navigate />
      </div>
      <div className="flex-1  "> {/* Ensure space for the sidebar */}
        <Outlet /> {/* This is where other pages will be displayed */}
      </div>
    </div>
  );
};

export default Layout;