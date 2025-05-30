import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [chats, setChats] = useState([
    {
      id: 1,
      name: 'Chat 1',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' }
      ]
    }
  ]);
  const [activeChatId, setActiveChatId] = useState(1);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredChatId, setHoveredChatId] = useState(null);

  const activeChat = chats.find(chat => chat.id === activeChatId);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const newMessages = [...activeChat.messages, { role: 'user', content: input }];
    setChats(chats.map(chat =>
      chat.id === activeChatId ? { ...chat, messages: newMessages } : chat
    ));
    setInput('');
    try {
      const res = await axios.post('http://localhost:5000/api/chat', { messages: newMessages });
      setChats(chats.map(chat =>
        chat.id === activeChatId
          ? { ...chat, messages: [...newMessages, res.data.choices[0].message] }
          : chat
      ));
    } catch (err) {
      setChats(chats.map(chat =>
        chat.id === activeChatId
          ? { ...chat, messages: [...newMessages, { role: 'assistant', content: 'Sorry, there was an error.' }] }
          : chat
      ));
    }
    setLoading(false);
  };

  const handleNewChat = () => {
    const newId = chats.length ? Math.max(...chats.map(c => c.id)) + 1 : 1;
    const newChat = {
      id: newId,
      name: `Chat ${newId}`,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' }
      ]
    };
    setChats([...chats, newChat]);
    setActiveChatId(newId);
    setInput('');
  };

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setInput('');
  };

  const handleDeleteChat = (id) => {
    const filteredChats = chats.filter(chat => chat.id !== id);
    setChats(filteredChats);
    // If the deleted chat was active, switch to another chat or create a new one
    if (id === activeChatId) {
      if (filteredChats.length > 0) {
        setActiveChatId(filteredChats[0].id);
      } else {
        // Create a new chat if none remain
        const newChat = {
          id: 1,
          name: 'Chat 1',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' }
          ]
        };
        setChats([newChat]);
        setActiveChatId(1);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col text-white">
      {/* Nav Bar */}
      <nav className="w-full bg-gray-950 shadow-md py-4 px-8 flex items-center justify-between border-b border-gray-800">
        <div className="text-2xl font-extrabold tracking-widest text-blue-400">ASTRA</div>
        {/* You can add more nav items or user profile here if needed */}
      </nav>
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 p-4 flex flex-col border-r border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Chats</h2>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              onClick={handleNewChat}
            >
              + New
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.map(chat => (
              <div
                key={chat.id}
                className={`relative group cursor-pointer px-3 py-2 rounded mb-2 flex items-center justify-between ${chat.id === activeChatId ? 'bg-blue-700 text-white font-semibold' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
                onClick={() => handleSelectChat(chat.id)}
                onMouseEnter={() => setHoveredChatId(chat.id)}
                onMouseLeave={() => setHoveredChatId(null)}
              >
                <span className="truncate flex-1">{chat.name}</span>
                {hoveredChatId === chat.id && chats.length > 1 && (
                  <button
                    className="ml-2 p-1 rounded hover:bg-red-600"
                    onClick={e => { e.stopPropagation(); handleDeleteChat(chat.id); }}
                    title="Delete chat"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl bg-gray-800 rounded shadow p-6 flex flex-col h-[80vh] mt-8">
            <div className="flex-1 overflow-y-auto mb-4">
              {activeChat.messages.filter(m => m.role !== 'system').map((msg, i) => (
                <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'}`}>
                    {msg.content}
                  </span>
                </div>
              ))}
              {loading && <div className="text-gray-400">Thinking...</div>}
            </div>
            <div className="flex">
              <input
                className="flex-1 border border-gray-700 bg-gray-700 text-white rounded px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                disabled={loading}
                placeholder="Type your message..."
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={sendMessage} disabled={loading || !input}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 