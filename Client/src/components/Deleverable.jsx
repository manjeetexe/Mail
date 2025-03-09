import React, { useState } from 'react';
import { FaFilePdf, FaImage } from 'react-icons/fa';
import Validator from './../page/Validator'

const SpamCheck = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [pdf, setPdf] = useState(null);
  const [image, setImage] = useState(null);
  const [spamResult, setSpamResult] = useState(null);
  const [loading, setLoading] = useState(false); // Loader state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const emailContent = `Subject: ${subject}\n\n${message}`;

    try {
      const response = await fetch('http://localhost:8000/api/spam-check', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailContent })
      });

      const data = await response.json();
      setSpamResult(data);
    } catch (error) {
      console.error('Error checking spam:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-6">
      <h1 className="text-3xl font-bold text-blue-600 py-3 mb-2">Spam Checker</h1>
      <div>
        <div className='flex items-start gap-3'>
        <form className="bg-white shadow-lg p-6 rounded-lg w-full max-w-2xl" onSubmit={handleSubmit}>
          <input 
            className="w-full p-2 border rounded mb-4" 
            type="text" 
            placeholder="Subject" 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
            required
          />
          <textarea 
            className="w-full p-2 border min-h-40 max-h-95 rounded mb-4" 
            placeholder="Message" 
            rows="5" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            required 
          ></textarea>

          {/* File Upload Section */}
          <div className="space-y-6">
            <div className="border p-4 mb-4 gap-4 rounded-lg bg-white shadow-md flex items-center">
              <label className="cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-400 rounded-lg w-1/2 text-gray-600 hover:bg-gray-100 transition">
                <FaFilePdf className="text-red-600 text-3xl mb-2" />
                <span>{pdf ? pdf.name : "Upload PDF"}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => setPdf(e.target.files[0])}
                />
              </label>
              <label className="cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-400 rounded-lg w-1/2 text-gray-600 hover:bg-gray-100 transition">
                <FaImage className="text-blue-600 text-3xl mb-2" />
                <span>{image ? image.name : "Upload Image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            </div>
          </div>

          {/* Submit Button with Loader */}
          <button 
            className="w-full bg-blue-600 text-white p-2 rounded flex justify-center items-center"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-2 border-t-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
            ) : (
              "Check Spam Score"
            )}
          </button>
        </form>
            <Validator />
        </div>

        

        {/* Spam Result Section */}
        {spamResult && (
          <div className="bg-white shadow-lg p-6 mt-6 rounded-lg w-full ">
            <h2 className="text-2xl font-semibold mb-4">Spam Score: {spamResult.score}</h2>
            <pre className="bg-gray-200 p-4 rounded-lg text-sm overflow-auto">{spamResult.report}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpamCheck;