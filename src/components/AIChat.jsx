import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, Bot, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIChat({ role }) {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen]);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user");
    }
  };

  const { data: messages = [] } = useQuery({
    queryKey: ["chatMessages", user?.email, role],
    queryFn: () => base44.entities.ChatMessage.filter({ user_email: user?.email, role }, "-created_date", 50),
    enabled: !!user && isOpen,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessageMutation = useMutation({
    mutationFn: async (content) => {
      // Save user message
      await base44.entities.ChatMessage.create({
        user_email: user.email,
        role,
        content,
        sender: "user",
      });

      // TODO: Later connect to POST /api/chat/send
      // For now, simulate AI response
      const aiResponse = generateAIResponse(content, role);
      await base44.entities.ChatMessage.create({
        user_email: user.email,
        role,
        content: aiResponse,
        sender: "assistant",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["chatMessages"]);
      setMessage("");
      setTimeout(scrollToBottom, 100);
    },
  });

  const generateAIResponse = (userMessage, userRole) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Role-specific responses
    const roleResponses = {
      user: {
        greeting: "Hi! I'm here to help you book rides and answer your questions. How can I assist you today?",
        ride: "To book a ride, you can click 'Book a Ride' button or message us on WhatsApp at +1 470 748 4747.",
        price: "Our pricing is fair and negotiable. You propose your price, and drivers can accept or counter-offer.",
        help: "I can help you with bookings, ride history, wallet management, and answering any questions about our service.",
      },
      driver: {
        greeting: "Hello driver! I'm here to help you maximize your earnings. What would you like to know?",
        earnings: "You can check your earnings in the dashboard. We offer competitive rates with no hidden fees.",
        online: "To start accepting rides, toggle the 'Go Online' switch in your dashboard.",
        help: "I can assist with ride management, earnings tracking, document uploads, and any driver-related questions.",
      },
      corporate: {
        greeting: "Welcome to JoltCab Corporate! I can help you manage your team's transportation needs.",
        booking: "You can book rides for your team members through the 'Book for Team' feature.",
        reports: "Monthly reports are available in your dashboard with detailed expense tracking.",
        help: "I can assist with team management, bookings, invoicing, and corporate account settings.",
      },
      hotel: {
        greeting: "Hello! I'm here to help you provide excellent transportation service to your guests.",
        booking: "You can book rides for guests using the 'Book for Guest' feature in your dashboard.",
        commission: "Your commission earnings are tracked in real-time and displayed in your dashboard.",
        help: "I can help with guest bookings, commission tracking, and integration with your hotel operations.",
      },
      dispatcher: {
        greeting: "Hi dispatcher! Ready to coordinate rides efficiently?",
        dispatch: "Use the 'Dispatch New Ride' feature to assign rides to available drivers.",
        drivers: "You can view all available drivers and their locations in the dashboard.",
        help: "I can assist with ride coordination, driver management, and dispatch operations.",
      },
    };

    const responses = roleResponses[userRole] || roleResponses.user;

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return responses.greeting;
    } else if (lowerMessage.includes("ride") || lowerMessage.includes("book")) {
      return responses.ride || responses.booking || responses.dispatch || responses.greeting;
    } else if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("earn")) {
      return responses.price || responses.earnings || responses.commission || "Our pricing is competitive and transparent. Would you like more details?";
    } else if (lowerMessage.includes("help")) {
      return responses.help;
    } else {
      return responses.greeting;
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      sendMessageMutation.mutate(message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-[#15B46A] to-[#0F9456] rounded-full shadow-2xl flex items-center justify-center text-white z-50 hover:shadow-green-500/50 transition-all"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] z-50 shadow-2xl"
          >
            <Card className="h-full flex flex-col">
              <CardHeader className="bg-gradient-to-r from-[#15B46A] to-[#0F9456] text-white">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  JoltCab AI Assistant
                </CardTitle>
                <p className="text-xs text-white/80 capitalize">{role} Support</p>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <Bot className="w-12 h-12 mx-auto mb-4 text-[#15B46A]" />
                    <p className="text-sm">Start a conversation!</p>
                    <p className="text-xs mt-2">Ask me anything about JoltCab</p>
                  </div>
                ) : (
                  <>
                    {messages.reverse().map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.sender === "user" ? "bg-[#15B46A]" : "bg-gray-200"
                        }`}>
                          {msg.sender === "user" ? (
                            <User className="w-5 h-5 text-white" />
                          ) : (
                            <Bot className="w-5 h-5 text-gray-700" />
                          )}
                        </div>
                        <div className={`max-w-[70%] rounded-2xl p-3 ${
                          msg.sender === "user"
                            ? "bg-[#15B46A] text-white rounded-tr-none"
                            : "bg-gray-100 text-gray-900 rounded-tl-none"
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </CardContent>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={sendMessageMutation.isPending}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!message.trim() || sendMessageMutation.isPending}
                    className="bg-[#15B46A] hover:bg-[#0F9456] rounded-full w-12 h-12 p-0"
                  >
                    {sendMessageMutation.isPending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}