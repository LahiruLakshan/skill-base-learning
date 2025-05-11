import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { IoSendSharp } from "react-icons/io5";
import { CHATBOT_URL } from '../../constants/config';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessage = {
      id: Date.now(),
      content: input,
      role: 'user',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setLoading(true);

    try {
      // Real API call
      const response = await axios.post(
        `${CHATBOT_URL}webhooks/rest/webhook`,
        {
          sender: 'user',
          message: input,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Handle API response
      if (response.data && response.data.length > 0) {
        const botMessage = {
          id: Date.now() + 1,
          content: response.data[0].text,
          role: 'assistant',
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-[70vh] flex flex-col p-4">
      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg shadow-inner">
        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'self-end bg-[#001F3F] text-white rounded-br-none'
                  : 'self-start bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
          {loading && (
            <div className="self-start max-w-[80%] p-3 bg-gray-100 rounded-lg rounded-bl-none">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Container */}
      <form onSubmit={handleSubmit} className="flex gap-2 p-2 bg-white rounded-lg shadow-md">
        <textarea
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          rows={1}
          maxRows={4}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2 text-white bg-[#0F3054] rounded-lg hover:bg-[#001F3F] disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <IoSendSharp className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;