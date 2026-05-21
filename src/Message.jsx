import { useState, useEffect, useRef} from "react";
import axios from "axios";
import "./Message.css"

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

const MAX_SUGGESTIONS = 4;

function Composer({ value, onChange, onKeyDown, onSend, canSend }) {
    return (
        <div className="composer-wrapper">
            <textarea className="composer-input"
                placeholder="Write a message..."
                rows={3}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
            />

            <div className="composer-toolbar">
                <div className="composer-icons">
                    <button className="toolbar-btn" title="Image">🖼️</button>
                    <button className="toolbar-btn" title="Attach">📎</button>
                    <button className="toolbar-btn" title="GIF">GIF</button>
                    <button className="toolbar-btn" title="Emoji">🙂</button>
                    <button className="toolbar-btn" title="More">•••</button>

                </div>
                <button
                    className={`send-btn ${canSend ? "active" : ""}`}
                    onClick={onSend}
                    disabled={!canSend}
                >
                    Send
                </button>

            </div>
        </div>
    );
}

function Messaging() {

    const [conversations, setConversations] = useState([]);
    const [selected, setSelected] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [showCompose, setShowCompose] = useState(false);
    const [recipient, setRecipient] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/conversations/", getAuthHeader())
            .then((res) => setConversations(res.data))
            .catch((err) => console.error("API error:", err));
    }, []);

    useEffect(() => {
        if (!selected) return;
        setLoading(true);
        setMessages([]);
        axios
            .get(`http://127.0.0.1:8000/api/messages/${selected.id}/`, getAuthHeader())
            .then((res) => {
                setMessages(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Messages error:", err);
                setLoading(false);
            });
    }, [selected]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const getDisplayName = (c) =>
        c.participants?.[0] ?? c.name ?? "Unknown";

    const handleSend = () => {
    if (!newMessage.trim()) return;
    const sentText = newMessage;
    setNewMessage("");

    // === Existing conversation ===
    if (selected) {
        setMessages((prev) => [...prev, { sender: "me", content: sentText }]);
        setConversations((prev) =>
            prev.map((c) =>
                c.id === selected.id ? { ...c, last_message: sentText } : c
            )
        );
        axios
            .post("http://127.0.0.1:8000/api/send-message/", {
                conversation_id: selected.id,
                content: sentText,
                
            }, getAuthHeader())
            .catch((err) => console.error("Send error:", err));
        return;
    }

    // === Nai conversation (compose view) === ← YAHAN CHANGE HUA
    const recipientName = recipient.trim();
    if (!recipientName) return;

    axios
        .post("http://127.0.0.1:8000/api/create-conversation/", {
            username: recipientName,
        }, getAuthHeader())
        .then((res) => {
            const newConv = {
                id: res.data.id,
                participants: [recipientName],
                last_message: sentText,
                date: "Just now",
            };
            setConversations((prev) => [newConv, ...prev]);
            setSelected(newConv);
            setShowCompose(false);
            setRecipient("");
            setMessages([{ sender: "me", content: sentText }]);

            return axios.post("http://127.0.0.1:8000/api/send-message/", {
                conversation_id: res.data.id,
                content: sentText,
            }, getAuthHeader());
        })
        .catch((err) => console.error("Error:", err));
};

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const filteredConversations = conversations.filter((c) => {
        const name = getDisplayName(c);
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });



    return (
        <div className="messaging">
            <section className="conversations">
                <div className="conv-header">
                    <div className="conv-header-row">
                        <h2>Messaging</h2>
                        <input className="search-input"
                            placeholder="Search messages"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="conv-header-icons">
                            <button className="icon-btn" title="More options">•••</button>
                            <button className="icon-btn compose-btn" title="New message"
                                onClick={() => {
                                    setShowCompose(true);
                                    setSelected(null);
                                    setMessages([]);
                                    setNewMessage("");
                                    setRecipient("");
                                }}>
                                ✏️
                            </button>
                        </div>
                    </div>
                </div>


                <div className="filters">
                    <button className="filter active">Focused ▾</button>
                    <button className="filter">Jobs</button>
                    <button className="filter">Unread</button>
                    <button className="filter">Connections</button>
                    <button className="filter">InMail</button>
                    <button className="filter">Starred</button>

                </div>

                <ul className="conv-list">
                    {filteredConversations.map((c) => {
                        const name = getDisplayName(c);
                        const initial = name?.[0]?.toUpperCase() ?? "?";
                        return (
                            <li key={c.id}
                                className={`conv-item ${selected?.id === c.id ? "selected" : ""}`}
                                onClick={() => {
                                    setSelected(c);
                                    setShowCompose(false);
                                    setNewMessage("");
                                }}
                            >
                                <div className="avatar">
                                    {c.avatar ? <img src={c.avatar} alt={name} /> : initial}
                                </div>
                                <div className="conv-text">
                                    <div className="conv-top">
                                        <strong>{name}</strong>
                                        <span className="date">{c.date ?? ""}</span>
                                    </div>
                                    <p>{c.last_message ?? ""}</p>
                                </div>
                            </li>
                        );
                     } )}
                    {filteredConversations.length === 0 && (
                        <li className="empty">No conversations yet</li>
                    )}

                </ul>

            </section>

            <section className="chat">


                {showCompose && (
                    <div className="compose-view">
                        <div className="chat-header">
                            <h3>New message</h3>
                        </div>
                        <input
                            className="recipient"
                            placeholder="Type a name or multiple names"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            autoFocus
                        />
                        <p className="suggested-label">Suggested</p>
                        <ul className="suggestions">
                            {conversations.slice(0, MAX_SUGGESTIONS).map((c) => {
                                const name = getDisplayName(c);
                                const initial = name?.[0]?.toUpperCase() ?? "?";
                                return (
                                    <li
                                        key={c.id}
                                        onClick={() => {
                                            setSelected(c);
                                            setShowCompose(false);
                                            setNewMessage("");
                                        }}
                                    >
                                        <div className="avatar small">{initial}</div>
                                        <span>{name}</span>
                                    </li>
                                );
                            })}
                        </ul>
                        <Composer
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onSend={handleSend}
                            canSend={newMessage.trim().length > 0}
                        />
                    </div>
                )}


                {selected && !showCompose && (
                    <div className="chat-view">
                        <div className="chat-header">
                            <h3>{getDisplayName(selected)}</h3>
                        </div>

                        <div className="messages-list">
                            {loading && <p className="loading-text">Loading...</p>}
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`message-bubble ${m.sender === "me" ? "sent" : "received"}`}
                                >
                                    {m.sender !== "me" && (
                                        <span className="bubble-sender">{m.sender}</span>
                                    )}
                                    <p>{m.content}</p>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <Composer
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onSend={handleSend}
                            canSend={newMessage.trim().length > 0}
                        />
                    </div>
                )}


                {!selected && !showCompose && (
                    <div className="chat-empty">
                        <p>select conversation <strong>✏️</strong></p>
                    </div>
                )}
            </section>
        </div>
    );
}


export default Messaging;