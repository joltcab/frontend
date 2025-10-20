import { useState, useEffect } from 'react';
import adminService from '@/services/dashboardService';

export default function ChatHistory() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const data = await adminService.getChatHistory();
      setChats(data.chats || []);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Chat History</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow border border-gray-200">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Conversations</h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : chats.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No chats found</div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedChat?._id === chat._id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{chat.user_name}</p>
                      <p className="text-sm text-gray-500 truncate">{chat.last_message}</p>
                    </div>
                    <span className="text-xs text-gray-400">{chat.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow border border-gray-200">
          {selectedChat ? (
            <>
              <div className="p-4 border-b">
                <h3 className="font-semibold">{selectedChat.user_name}</h3>
                <p className="text-sm text-gray-500">Trip ID: {selectedChat.trip_id}</p>
              </div>
              <div className="p-4 max-h-[500px] overflow-y-auto space-y-4">
                {selectedChat.messages?.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === 'user' ? 'bg-gray-100' : 'bg-green-500 text-white'
                    }`}>
                      <p>{msg.message}</p>
                      <span className="text-xs opacity-75">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a conversation to view messages
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
