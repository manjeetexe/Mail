import React from 'react'
import { FaArrowRight } from "react-icons/fa6";
import { BiAlignLeft } from "react-icons/bi";
import Footer from './../components/Footer'
import { HiOutlineLightningBolt } from "react-icons/hi";
import { Link } from 'react-router-dom';




const Team = () => {
  return (
    <>
        <section className='h-screen bg-screen overflow-hidden '>
                <nav className='h-20 w-screen flex justify-between items-center px-20 bg-white'>

                    <div className='text-5xl font-medium text-blue-600'>
                        <h1>Nexido</h1>
                    </div>

                    <div className='flex items-center gap-8 text-lg'>
                        <h1>Feature</h1>
                        <h1>Team</h1>
                        <h1>Contacts</h1>
                        <Link to='/' className='px-5 flex items-center gap-2  py-2 text-white rounded-md bg-blue-600'>
                            <h1>Get Started </h1>
                            <FaArrowRight />
                        </Link>
                    </div>

                </nav>

                <main className=' bg-white flex w-full h-full '>

                   <div className='w-1/2 pl-20 py-10 '>

                        <div className='bg-blue-300 rounded-2xl px-5 py-1 text-lg flex justify-center items-center w-40'>Powered by AI</div>
                        <h1 className='text-8xl pt-15 text-black font-medium  leading-20 '>Your Ultimate Bulk Email Solution</h1>

                        <p className='text-xl pt-15 text-black '>
                        Send unlimited emails effortlessly with high deliverability and automation, ensuring your message reaches the right inbox every time!
                        </p>


                        <div className='flex gap-5 mt-10  text-white'>
                            <div className='bg-blue-500 text-xl flex gap-2 items-center px-7 py-4 rounded-lg'>
                                    <div className=''>
                                        Get Started
                                    </div>
                                    <FaArrowRight />
                            </div>

                            <div className='text-blue-600 border gap-2 border-gray-300  text-xl flex items-center px-7 py-4 rounded-lg'>
                                    <div className=''>
                                        View Demo
                                    </div>
                                    <BiAlignLeft className='text-xl'/>
                                   
                            </div>
                            
                        </div>

                   </div>

                   <div className='w-1/2 flex justify-center px-16 items-center'>


                    <div className='w-full h-100 mb-26 rounded-lg bg-blue-500'>


                    </div>
























                   </div>






                </main>

        </section>

        <section className=' flex py-20 justify-center items-center flex-col w-screen bg-white'>
            <h1 className='text-5xl  font-medium text-center'>Powerful Features</h1>

            <p className='text-xl text-center pt-10 w-1/2 '>Everything you need to succeed on Email-Marketing, powered by cutting-edge AI technology</p>

            <div className='flex mt-10 justify-center items-center  flex-wrap gap-5 px-20'>
                <div className='h-70 p-6 rounded-lg w-100 border-2  border-gray-300 '>
                    <div className='p-3 bg-blue-300 w-14 rounded-lg  text-blue-600'>
                        <HiOutlineLightningBolt className='text-3xl'/>
                    </div>
                    <h1 className='text-2xl font-bold pt-5'>Unlimited Email Sending </h1>
                    <p className='pt-3 text-xl'>No sending limits! Reach thousands of recipients instantly and scale your campaigns effortlessly.</p>

                </div>
                <div className='h-70 p-6 rounded-lg w-100 border-2  border-gray-300 '>
                    <div className='p-3 bg-blue-300 w-14 rounded-lg  text-blue-600'>
                        <HiOutlineLightningBolt className='text-3xl'/>
                    </div>
                    <h1 className='text-2xl font-bold pt-5'>Personalized Email Campaigns </h1>
                    <p className='pt-3 text-xl'>Customize emails with dynamic content and placeholders to create a tailored experience for each recipient.</p>

                </div>
                <div className='h-70 p-6 rounded-lg w-100 border-2  border-gray-300 '>
                    <div className='p-3 bg-blue-300 w-14 rounded-lg  text-blue-600'>
                        <HiOutlineLightningBolt className='text-3xl'/>
                    </div>
                    <h1 className='text-2xl font-bold pt-5'>Real-time Analytics & Tracking</h1>
                    <p className='pt-3 text-xl'>Get detailed insights on open rates, click-throughs, bounces, and engagement to optimize your email performance.</p>

                </div>
                <div className='h-70 p-6 rounded-lg w-100 border-2  border-gray-300 '>
                    <div className='p-3 bg-blue-300 w-14 rounded-lg  text-blue-600'>
                        <HiOutlineLightningBolt className='text-3xl'/>
                    </div>
                    <h1 className='text-2xl font-bold pt-5'>SMTP & API Integration</h1>
                    <p className='pt-3 text-xl'>Easily connect with SMTP servers or powerful email APIs like SendGrid, Mailgun, and more for seamless email delivery.</p>

                </div>
                <div className='h-70 p-6 rounded-lg w-100 border-2  border-gray-300 '>
                    <div className='p-3 bg-blue-300 w-14 rounded-lg  text-blue-600'>
                        <HiOutlineLightningBolt className='text-3xl'/>
                    </div>
                    <h1 className='text-2xl font-bold pt-5'>High Deliverability </h1>
                    <p className='pt-4 text-xl'>Advanced email optimization to bypass spam filters and ensure your messages land directly in the inbox.</p>

                </div>
                <div className='h-70 p-6 rounded-lg w-100 border-2  border-gray-300 '>
                    <div className='p-3 bg-blue-300 w-14 rounded-lg  text-blue-600'>
                        <HiOutlineLightningBolt className='text-3xl'/>
                    </div>
                    <h1 className='text-2xl font-bold pt-5'>Automated Scheduling & Drip Campaigns </h1>
                    <p className='pt-4 text-xl'>Schedule your emails in advance, set up automated follow-ups, and run drip sequences for maximum engagement.
                    </p>

                </div>
                
                
            </div>
        </section>

        <section className=' flex py-20 justify-center items-center flex-col w-screen bg-white'>
            <h1 className='text-5xl  font-medium text-center'>Powerful Features</h1>

            <p className='text-xl text-center pt-10 w-1/2 '>The brilliant minds behind SocialAnalytics, bringing together expertise in development, data science, and design</p>

            <div className='flex mt-10 justify-center items-center  flex-wrap gap-5 px-10'>
            <div className='h-60 text-xl  flex flex-col justify-center items-center gap-3 font-bold rounded-lg w-80 border-2 border-gray-300 '>
                    <h1>Chahat Kesharwani</h1>
                    <h1 className='text-blue-700'>Designer & Developer</h1>
                    <h1 className='text-base'>NIT Jalandhar (2027)</h1>

                </div>
                <div className='h-60 text-xl  flex flex-col justify-center items-center gap-3 font-bold rounded-lg w-80 border-2 border-gray-300 '>
                    <h1>Chahat Kesharwani</h1>
                    <h1 className='text-blue-700'>Designer & Developer</h1>
                    <h1 className='text-base'>NIT Jalandhar (2027)</h1>

                </div>
                <div className='h-60 text-xl  flex flex-col justify-center items-center gap-3 font-bold rounded-lg w-80 border-2 border-gray-300 '>
                    <h1>Chahat Kesharwani</h1>
                    <h1 className='text-blue-700'>Designer & Developer</h1>
                    <h1 className='text-base'>NIT Jalandhar (2027)</h1>

                </div>
                <div className='h-60 text-xl  flex flex-col justify-center items-center gap-3 font-bold rounded-lg w-80 border-2 border-gray-300 '>
                    <h1>Chahat Kesharwani</h1>
                    <h1 className='text-blue-700'>Designer & Developer</h1>
                    <h1 className='text-base'>NIT Jalandhar (2027)</h1>

                </div>
                
                
                
            </div>
        </section>
        <Footer />
       

    
    </>
  )
}

export default Team
