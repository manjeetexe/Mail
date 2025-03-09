import React, { useState } from 'react';
import axios from 'axios';

const UltimateSend = () => {
  const [selectedOption, setSelectedOption] = useState('few');
  const [savedMessages, setSavedMessages] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSaveMessage = () => {
    if (subject && message) {
      const exists = savedMessages.some(msg => msg.subject === subject && msg.message === message);
      if (!exists) {
        setSavedMessages([...savedMessages, { subject, message }]);
      } else {
        alert('Message with this subject already exists!');
      }
    }
  };






  const handleSendEmail = async () => {
    if (!email || !subject || !message) {
        alert("Please fill all required fields (Email, Subject, Message)");
        return;
    }

    setLoading(true);

    const endpoint = selectedOption === 'few' 
      ? 'http://localhost:8000/sendmail/few-mail' 
      : selectedOption === 'bulk' 
      ? 'http://localhost:8000/sendmail/bulk-mail' 
      : 'http://localhost:8000/sendmail/ultimate-mail';

    try {
        let data;

        if (file) {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('cc', cc);
            formData.append('bcc', bcc);
            formData.append('subject', subject);
            formData.append('message', message);
            formData.append('attachment', file);

            data = formData;
        } else {
            data = { email, cc, bcc, subject, message };
        }

        const response = await axios.post(endpoint, data, {
            headers: { 'Content-Type': file ? 'multipart/form-data' : 'application/json' }
        });

        alert(response.data.message || 'Email Sent Successfully!');
        setSavedMessages([...savedMessages, { subject, message }]);

        // Clear the form
        setEmail('');
        setCc('');
        setBcc('');
        setSubject('');
        setMessage('');
        setFile(null);
    } catch (error) {
        console.error('Error sending email:', error.response ? error.response.data : error.message);
        alert('Failed to send email');
    } finally {
        setLoading(false);
    }
};



  return (
    <div className='flex h-screen'>
      <div className="min-h-screen bg-gray-100 w-full min-w-3xl max-w-3xl flex flex-col p-6">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Ultimate Bulk Mail Sender</h1>

        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
          <h2 className="text-2xl font-semibold mb-4">Select Mail Sending Option</h2>
          <div className="flex gap-4 mb-6">
            {['few', 'bulk', 'ultimate'].map(option => (
              <button 
                key={option}
                className={`px-4 py-2 rounded-lg ${selectedOption === option ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} 
                onClick={() => setSelectedOption(option)}
              >{option.charAt(0).toUpperCase() + option.slice(1)} Emails</button>
            ))}
          </div>

          <form className="space-y-4">
            {selectedOption !== 'ultimate' && (
              <>
                <input className="w-full p-2 border rounded" type="email"  required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input className="w-full p-2 border rounded" type="email" placeholder="CC" value={cc} onChange={e => setCc(e.target.value)} />
                <input className="w-full p-2 border rounded" type="email" placeholder="BCC" value={bcc} onChange={e => setBcc(e.target.value)} />
              </>
            )}
            <input className="w-full p-2 border rounded" type="text" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} required />
            <textarea className="w-full p-2 border rounded" placeholder="Message" rows="4" value={message} onChange={e => setMessage(e.target.value)} required></textarea>
            {selectedOption !== 'few' && <input className="w-full p-2 border rounded" type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />}
            <button 
              type="button" 
              className="w-full bg-blue-600 text-white p-2 rounded" 
              onClick={handleSendEmail} 
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Email'}
            </button>
            <button type="button" className="w-full bg-green-600 text-white p-2 rounded" onClick={handleSaveMessage}>Save Message</button>
          </form>
        </div>
      </div>

      <div className='h-full w-full p-4 bg-gray-100 border-l-[1px] border-black'>
        <h1 className="text-4xl font-bold text-black mb-6">Previous Messages</h1>
        <div>
          {savedMessages.length > 0 && (
            <div className="mt-7">
              <ul className="space-y-2 overflow-hidden">
                {savedMessages.map((msg, index) => (
                  <li key={index} className="p-2 bg-white shadow-lg rounded-lg cursor-pointer" onClick={() => {
                    setSubject(msg.subject);
                    setMessage(msg.message);
                  }}>
                    <strong>{msg.subject}</strong>
                    <h1>{msg.message}</h1>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UltimateSend;
