import React from 'react';
import { FaEnvelope, FaChartBar, FaClock, FaCogs } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div className='p-8 bg-gray-100 min-h-screen '>
      <h1 className='text-3xl font-bold mb-6'>Dashboard</h1>

      {/* Stats Section */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow-md flex items-center gap-4'>
          <FaEnvelope className='text-blue-500 text-4xl' />
          <div>
            <h2 className='text-xl font-semibold'>Total Emails Sent</h2>
            <p className='text-gray-600 text-lg'>12,340</p>
          </div>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md flex items-center gap-4'>
          <FaChartBar className='text-green-500 text-4xl' />
          <div>
            <h2 className='text-xl font-semibold'>Open Rate</h2>
            <p className='text-gray-600 text-lg'>76%</p>
          </div>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md flex items-center gap-4'>
          <FaClock className='text-yellow-500 text-4xl' />
          <div>
            <h2 className='text-xl font-semibold'>Scheduled Emails</h2>
            <p className='text-gray-600 text-lg'>25</p>
          </div>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md flex items-center gap-4'>
          <FaCogs className='text-red-500 text-4xl' />
          <div>
            <h2 className='text-xl font-semibold'>SMTP Integrations</h2>
            <p className='text-gray-600 text-lg'>3 Active</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className='mt-10 bg-white p-6 rounded-lg shadow-md'>
        <h2 className='text-2xl font-semibold mb-4'>Recent Activity</h2>
        <ul className='list-disc pl-5 space-y-2 text-lg text-gray-700'>
          <li>Email campaign "Spring Sale" sent to 5,000 recipients</li>
          <li>SMTP settings updated successfully</li>
          <li>New email template "Holiday Greetings" created</li>
          <li>Scheduled email "Weekly Newsletter" for March 12</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
