import { useEffect, useState } from "react";
import "./Chat.css";

function Chat() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [phase, setPhase] = useState("");

  useEffect(() => {
    // Fetch initial bot message
    const fetchInitialMessage = async () => {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "__INIT__" }),
      });
      const data = await res.json();
      setChatHistory([{ sender: "bot", text: data.reply }]);
      setPhase(data.phase);
    };

    fetchInitialMessage();
  }, []);

const sendMessage = async () => {
  if (!message.trim()) return;

  // Push user message once
  setChatHistory((prev) => [...prev, { sender: "user", text: message }]);

  // ✅ Clear message immediately after sending
  setMessage("");

  const res = await fetch("http://localhost:5000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();

  // Append bot's reply
  setChatHistory((prev) => [
    ...prev,
    { sender: "bot", text: data.reply }
  ]);

  setPhase(data.phase);
};


  return (
    <div className="chat-container">
      <h2 className="chat-title">Let's Begin Drafting Your Project Idea !</h2>

      <div className="chat-box">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            <strong>{msg.sender === "user" ? "You" : "REA"}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          placeholder="Type your message..."
          className="chat-input"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // prevent newline
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage} className="chat-send-button">
          Send
        </button>
      </div>

      <p className="chat-phase"><strong>Phase:</strong> {phase}</p>
    </div>
  );
}

export default Chat;
