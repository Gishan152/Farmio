import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import buyerAvatar from '.././../../Assets/Farmer/Profile Pictures/2.1.jpg';
import manujaAvatar from '.././../../Assets/Farmer/Profile Pictures/2.1.jpg';

export default function FarmerChat() {
  const [contacts] = useState([
    { id: 1, name: 'Ruwan Perera', role: 'Buyer', avatar: buyerAvatar },
    { id: 2, name: 'Nadeesha Silva', role: 'Buyer', avatar: buyerAvatar },
    { id: 3, name: 'Moderator', role: 'Moderator', avatar: buyerAvatar },
    { id: 0, name: 'Manuja', role: 'Farmer', avatar: manujaAvatar },
  ]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (selected) {
      // simulate fetch chat history
      setMessages([
        { from: selected.name, text: 'Welcome to chat!', avatar: selected.avatar, timestamp: '09:00 AM' },
      ]);
    }
  }, [selected]);

  const sendMsg = () => {
    if (!input.trim()) return;
    const newMsg = { from: 'Manuja', text: input, avatar: manujaAvatar, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    // TODO: send to backend
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white border-r overflow-auto">
        <h2 className="p-4 font-semibold text-lg">Chat</h2>
        {contacts.map(c => (
          <div
            key={c.id}
            onClick={() => setSelected(c)}
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 transition ${selected?.id === c.id ? 'bg-gray-100' : ''}`}
          >
            <img src={c.avatar} alt={c.name} className="h-10 w-10 rounded-full mr-3" />
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-gray-500">{c.role}</p>
            </div>
          </div>
        ))}
      </aside>

      {/* Chat Area */}
      <section className="flex-1 flex flex-col">
        {selected ? (
          <>
            <div className="flex-1 p-4 overflow-auto space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex items-start space-x-3 ${m.from === 'Manuja' ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <img src={m.avatar} alt={m.from} className="h-8 w-8 rounded-full" />
                  <div className="max-w-xs">
                    <p className="text-sm text-gray-700">{m.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{m.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-white flex items-center">
              <input
                className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={e => e.key === 'Enter' && sendMsg()}
              />
              <button onClick={sendMsg} className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a contact to chat
          </div>
        )}
      </section>
    </div>
  );
}
