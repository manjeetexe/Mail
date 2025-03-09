import React from 'react'
import { Link } from 'react-router-dom'
import N from './../../public/N/N.png'


const Navigate = () => {
  return (
    <>
        <div className="w-64  h-screen bg-black text-white p-4 fixed">
            <div className='flex mb-5 gap-2 items-center'>
                <img className='size-10' src={N} alt="" />
                <h2 className="text-3xl font-bold my-5">Bulk Mailer</h2>
            </div>
            <nav className="flex  flex-col space-y-4">
                <Link to="/" className=" p-2 ">Dashboard</Link>
                <Link to="/unlimited" className=" p-2  rounded">Unlimited Sending</Link>
                <Link to="/spam" className=" p-2 rounded">High Deliverability</Link>
                <Link to="/personalized" className=" p-2 rounded">Personalized Campaigns</Link>
                <Link to="/analytics" className=" p-2 rounded">Real-time Analytics</Link>
                <Link to="/smtp" className=" p-2 rounded">SMTP & API Integration</Link>
                <Link to="/automation" className=" p-2 rounded">Automated Scheduling</Link>
            </nav>
        </div>
        <div>

            
        </div>
    </>
  )
}

export default Navigate