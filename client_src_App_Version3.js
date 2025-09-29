import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [entered, setEntered] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("chat message", (msgObj) => {
      setMessages((prev) => [...prev, msgObj]);
    });
    return () => {
      socket.off("chat message");
    };
  }, []);

  const handleEnter = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setEntered(true);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && username) {
      const msgObj = {
        username,
        text: message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      socket.emit("chat message", msgObj);
      setMessage("");
    }
  };

  if (!entered) {
    return (
      <div style={{ maxWidth: 400, margin: "5rem auto", fontFamily: "sans-serif", textAlign: "center" }}>
        <h2>Enter Chat</h2>
        <form onSubmit={handleEnter}>
          <input
            style={{ width: "80%", padding: 8, fontSize: 16 }}
            placeholder="Enter your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
          <br /><br />
          <button type="submit" style={{ width: "50%", padding: 8, fontSize: 16 }}>Enter</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Chat App</h2>
      <div style={{ border: "1px solid #ccc", padding: 10, minHeight: 200, marginBottom: 10, background: "#fafafa" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: "6px 0" }}>
            <span style={{ fontWeight: "bold" }}>{msg.username || "Anonymous"}</span>
            <span style={{ color: "#888", marginLeft: 8, fontSize: 12 }}>{msg.time}</span>
            <div style={{ marginLeft: 16 }}>{msg.text}</div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          style={{ width: "80%", padding: 8 }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" style={{ width: "18%", padding: 8 }}>Send</button>
      </form>
    </div>
  );
}

export default App;