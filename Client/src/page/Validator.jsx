import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [pdfBlob, setPdfBlob] = useState(null);

    // Handle file selection
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // Upload the file and process response
    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a PDF file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        setMessage("");
        setPdfBlob(null);

        try {
            const response = await axios.post("http://localhost:8000/validate-emails-pdf", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                responseType: "blob", // Ensuring the response is treated as a binary file
            });

            // Check if the response is a valid PDF by looking at headers
            const contentType = response.headers["content-type"];
            if (contentType.includes("application/pdf")) {
                setPdfBlob(response.data);
                setMessage("Emails validated. Download the PDF below.");
            } else {
                setMessage("Unexpected response format. Please check your backend.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            setMessage("Error uploading file. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    // Download the stored PDF
    const handleDownload = () => {
        if (!pdfBlob) return;

        const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "active_emails.pdf");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="flex flex-col items-center justify-center  bg-gray-100">
            {/* File Upload Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-center">
                    Upload PDF for Email Validation
                </h2>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="mb-4 p-2 border rounded w-full"
                />
                <button
                    onClick={handleUpload}
                    className={`w-full p-2 rounded text-white ${uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                    disabled={uploading}
                >
                    {uploading ? "Uploading..." : "Upload PDF"}
                </button>
                {message && <p className="mt-3 text-center text-gray-700">{message}</p>}
            </div>

            {/* Display Download Button if PDF is available */}
            {pdfBlob && (
                <div className="bg-white p-6 mt-6 rounded-lg shadow-lg w-full max-w-md text-center">
                    <button
                        onClick={handleDownload}
                        className="w-full p-2 rounded text-white bg-green-600 hover:bg-green-700"
                    >
                        Download Active Emails PDF
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUpload;