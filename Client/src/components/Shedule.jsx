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
    const fetchScheduledEmails = async () => {
        try {
            const response = await axios.get("http://localhost:8000/sendmail/scheduled-mails");
            setScheduledCampaigns(response.data.scheduledEmails);
        } catch (error) {
            console.error("Error fetching scheduled emails:", error);
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

        try {
            await axios.post("http://localhost:8000/sendmail/schedule-mail", { campaignName, emails: validEmails });

            setCampaignName("");
            setEmails([{ to: "", cc: "", bcc: "", subject: "", message: "", scheduleTime: "" }]);
            alert("Emails scheduled successfully!");
            fetchScheduledEmails(); // Refresh scheduled emails
        } catch (error) {
            console.error("Error scheduling emails:", error);
            alert("Error scheduling emails. Please try again.");
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
                    <h3 className="text-xl font-semibold mb-4">Scheduled Campaigns</h3>
                    {scheduledCampaigns.map((campaign, index) => (
                        <div key={index} className="mb-4 p-4 border rounded-lg shadow">
                            <h4 className="font-semibold">{campaign.campaignName}</h4>
                            <ul className="mt-2">
                                {campaign.emails.map((email, i) => (
                                    <li key={i} className="text-sm text-gray-700">
                                        📩 {email.to} - <strong>Subject:</strong> {email.subject} - ⏳ {format(new Date(email.scheduleTime), "PPpp")}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmailScheduler;