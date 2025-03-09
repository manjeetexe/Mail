import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";

const EmailScheduler = () => {
    const [campaignName, setCampaignName] = useState("");
    const [emails, setEmails] = useState([
        { to: "", cc: "", bcc: "", subject: "", message: "", scheduleTime: "" }
    ]);
    const [scheduledCampaigns, setScheduledCampaigns] = useState([]);

    // Fetch scheduled emails from backend


    const groupEmailsByCampaign = (emails) => {
        const grouped = {};
    
        emails.forEach((email) => {
            const campaign = email.campaignName || "Unnamed Campaign";
    
            if (!grouped[campaign]) {
                grouped[campaign] = [];
            }
            grouped[campaign].push(email);
        });
    
        return Object.entries(grouped).map(([campaignName, emails]) => ({
            campaignName,
            emails,
        }));
    };

    


    const fetchScheduledEmails = async () => {
        try {
            const response = await axios.get("http://localhost:8000/sendmail/scheduled-mails");
    
            console.log("✅ Fetched Scheduled Emails:", response.data);
    
            if (response.data && Array.isArray(response.data.scheduledEmails)) {
                const groupedCampaigns = groupEmailsByCampaign(response.data.scheduledEmails);
                setScheduledCampaigns(groupedCampaigns);
            } else {
                console.error("❌ Unexpected response format:", response.data);
                setScheduledCampaigns([]);
            }
        } catch (error) {
            console.error("Error fetching scheduled emails:", error);
            setScheduledCampaigns([]);
        }
    };

    useEffect(() => {
        fetchScheduledEmails();
    }, []);

    // Handle input changes
    const handleInputChange = (index, field, value) => {
        const updatedEmails = [...emails];
        updatedEmails[index][field] = value;
        setEmails(updatedEmails);
    };

    // Add a new email
    const addEmail = () => {
        setEmails([...emails, { to: "", cc: "", bcc: "", subject: "", message: "", scheduleTime: "" }]);
    };

    // Remove an email
    const removeEmail = (index) => {
        setEmails(emails.filter((_, i) => i !== index));
    };

    // Check if selected date is valid (future date only)
    const isValidScheduleTime = (time) => {
        return new Date(time) > new Date();
    };

    // Schedule emails
    const scheduleCampaign = async () => {
        if (!campaignName.trim()) {
            alert("Please enter a campaign name.");
            return;
        }
    
        const validEmails = emails.filter(email => email.to && email.subject && email.message && email.scheduleTime);
    
        if (validEmails.length === 0) {
            alert("Please fill all fields including To, Subject, Message, and Schedule Time.");
            return;
        }
    
        if (!validEmails.every(email => isValidScheduleTime(email.scheduleTime))) {
            alert("Please select a future time for scheduling.");
            return;
        }
    
        console.log("📤 Sending request to schedule email...");
        console.log("Request Data:", { campaignName, emails: validEmails });
    
        try {
            const response = await axios.post("http://localhost:8000/sendmail/schedule-mail", { campaignName, emails: validEmails });
    
            console.log("✅ Response from server:", response.data); // Log server response
    
            setCampaignName("");
            setEmails([{ to: "", cc: "", bcc: "", subject: "", message: "", scheduleTime: "" }]);
            alert("Emails scheduled successfully!");
    
            fetchScheduledEmails(); // Refresh scheduled emails
        } catch (error) {
            console.error("❌ Error scheduling emails:", error);
    
            if (error.response) {
                console.error("Server Response:", error.response.data);
                alert(`Error: ${error.response.data.message || "Failed to schedule emails."}`);
            } else if (error.request) {
                console.error("No response received from server:", error.request);
                alert("Error: No response from server. Please check the backend.");
            } else {
                console.error("Request setup error:", error.message);
                alert("Error: Unable to send request. Please try again.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <h2 className="text-2xl font-semibold mb-4 text-center">Automated Email Scheduling</h2>

                {/* Campaign Name */}
                <input
                    type="text"
                    placeholder="Campaign Name"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="mb-4 p-2 border rounded w-full"
                />

                {/* Email List */}
                {emails.map((emailItem, index) => (
                    <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
                        <input
                            type="email"
                            placeholder="To (Recipient Email)"
                            value={emailItem.to}
                            onChange={(e) => handleInputChange(index, "to", e.target.value)}
                            className="p-2 border rounded w-full mb-2"
                        />
                        <input
                            type="email"
                            placeholder="CC (Optional)"
                            value={emailItem.cc}
                            onChange={(e) => handleInputChange(index, "cc", e.target.value)}
                            className="p-2 border rounded w-full mb-2"
                        />
                        <input
                            type="email"
                            placeholder="BCC (Optional)"
                            value={emailItem.bcc}
                            onChange={(e) => handleInputChange(index, "bcc", e.target.value)}
                            className="p-2 border rounded w-full mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Subject"
                            value={emailItem.subject}
                            onChange={(e) => handleInputChange(index, "subject", e.target.value)}
                            className="p-2 border rounded w-full mb-2"
                        />
                        <textarea
                            placeholder="Message"
                            value={emailItem.message}
                            onChange={(e) => handleInputChange(index, "message", e.target.value)}
                            className="p-2 border rounded w-full mb-2 h-24"
                        />
                        <input
                            type="datetime-local"
                            value={emailItem.scheduleTime}
                            onChange={(e) => handleInputChange(index, "scheduleTime", e.target.value)}
                            className="p-2 border rounded w-full"
                            min={new Date().toISOString().slice(0, 16)}
                        />
                        {index > 0 && (
                            <button onClick={() => removeEmail(index)} className="p-2 bg-red-500 text-white rounded mt-2 w-full">
                                ✕ Remove Email
                            </button>
                        )}
                    </div>
                ))}

                {/* Add Email Button */}
                <button
                    onClick={addEmail}
                    className="w-full p-2 mb-4 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                    + Add Follow-Up Email
                </button>

                {/* Schedule Button */}
                <button
                    onClick={scheduleCampaign}
                    className="w-full p-2 rounded bg-green-600 text-white hover:bg-green-700"
                >
                    Schedule Campaign
                </button>
            </div>

            {/* Scheduled Campaigns List */}
           {scheduledCampaigns.length > 0 && (
    <div className="bg-white p-6 mt-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Scheduled Campaigns</h3>

        {scheduledCampaigns.map((campaign, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-300 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-blue-600">{campaign.campaignName}</h4>

                {campaign.emails.map((email, idx) => (
                    <div key={idx} className="mt-3 bg-gray-100 p-4 rounded-lg">
                        <p><strong className="text-gray-700">To:</strong> {email.to}</p>
                        {email.cc && <p><strong className="text-gray-700">CC:</strong> {email.cc}</p>}
                        {email.bcc && <p><strong className="text-gray-700">BCC:</strong> {email.bcc}</p>}
                        <p><strong className="text-gray-700">Subject:</strong> {email.subject}</p>
                        <p><strong className="text-gray-700">Message:</strong> {email.message}</p>
                        <p><strong className="text-gray-700">Schedule Time:</strong> {new Date(email.scheduleTime).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        ))}
    </div>
)}
        </div>
    );
};

export default EmailScheduler;