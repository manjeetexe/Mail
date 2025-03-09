import React, { useState } from "react";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() === "") return;

    const newMessage = { text: input, sender: "You" };
    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto relative bg-white shadow-lg rounded-lg">
      {/* Chat Messages */}
      <div className="p-4 h-[calc(100%-66px)] border-b overflow-y-auto ">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">Start the conversation...</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg max-w-xs ${
                msg.sender === "You" ? "bg-blue-500 text-white ml-auto" : "bg-gray-200"
              }`}
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))
        )}
      </div>

      {/* Input & Send Button */}
      <div className="p-3 flex absolute bottom-0 w-full border-t">
        <input
          type="text"
          className="flex-1 p-2 border rounded-l-lg focus:outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;