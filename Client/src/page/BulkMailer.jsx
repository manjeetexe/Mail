import { useState } from "react";
import axios from "axios";

const SponsorForm = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) return alert("Please upload a PDF file.");

    setLoading(true);
    setStatus("");

    const formData = new FormData();
    formData.append("pdf", pdfFile);
    formData.append("cc", cc);
    formData.append("bcc", bcc);
    formData.append("subject", subject);
    formData.append("message", message);

    try {
      const response = await axios.post("http://localhost:8000/api/send-mail-bulk", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus(response.data.success);
    } catch (error) {
      setStatus("Error sending email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Send Emails from PDF</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Upload PDF (List of Emails)</label>
          <input type="file" accept="application/pdf" onChange={handleFileChange} required className="w-full px-3 py-2 border rounded-md bg-gray-800 text-white" />
        </div>

        <div>
          <label className="block font-medium mb-1">CC Emails (Comma-separated)</label>
          <input type="text" value={cc} onChange={(e) => setCc(e.target.value)} className="w-full px-3 py-2 border rounded-md bg-gray-800 text-white" placeholder="CC Emails" />
        </div>

        <div>
          <label className="block font-medium mb-1">BCC Emails (Comma-separated)</label>
          <input type="text" value={bcc} onChange={(e) => setBcc(e.target.value)} className="w-full px-3 py-2 border rounded-md bg-gray-800 text-white" placeholder="BCC Emails" />
        </div>

        <div>
          <label className="block font-medium mb-1">Subject</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required className="w-full px-3 py-2 border rounded-md bg-gray-800 text-white" placeholder="Email Subject" />
        </div>

        <div>
          <label className="block font-medium mb-1">Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required className="w-full px-3 py-2 border rounded-md bg-gray-800 text-white" placeholder="Type message here..." />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-500" disabled={loading}>
          {loading ? "Sending..." : "Send Emails"}
        </button>
      </form>

      {status && <p className="mt-4 text-center text-green-400">{status}</p>}
    </div>
  );
};

export default SponsorForm;