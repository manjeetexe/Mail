import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [emails, setEmails] = useState([]);
    const [message, setMessage] = useState("");

    // Handle file selection
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // Handle file upload
    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a PDF file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        setMessage("");

        try {
            const response = await axios.post("http://localhost:8000/validate-emails-pdf", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setEmails(response.data.emails || []);
            setMessage("File uploaded successfully!");
        } catch (error) {
            setMessage("Error uploading file. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Upload PDF for Email Validation</h2>
                <input type="file" accept="application/pdf" onChange={handleFileChange} className="mb-4 p-2 border rounded w-full" />
                <button
                    onClick={handleUpload}
                    className={`w-full p-2 rounded text-white ${uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                    disabled={uploading}
                >
                    {uploading ? "Uploading..." : "Upload PDF"}
                </button>
                {message && <p className="mt-3 text-center text-gray-700">{message}</p>}

                {/* Display extracted emails */}
                {emails.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Extracted Emails:</h3>
                        <ul className="mt-2 text-sm text-gray-700">
                            {emails.map((email, index) => (
                                <li key={index} className="border-b py-1">{email.email} - {email.status}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;