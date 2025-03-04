import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
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
                responseType: "blob", // Expecting a PDF file
            });

            if (response.data.type !== "application/json") {
                // Create a download link for the PDF response
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "active_emails.pdf");
                document.body.appendChild(link);
                link.click();

                setMessage("PDF downloaded successfully!");
            } else {
                setMessage("No active emails found in the file.");
            }
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
            </div>
        </div>
    );
};

export default FileUpload;