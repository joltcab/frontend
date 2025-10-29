
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  MessageCircle, // Added
  Search, // Added
  Phone, // Added
  Mail, // Added
  MapPin, // Added
  CreditCard, // Added
  User, // Added
  Car, // Added
  Shield, // Added
  ChevronRight, // Added
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/components/i18n/useTranslation"; // Updated
import AIChat from "@/components/AIChat"; // Assuming AIChat component path

export default function Support() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    category: "general",
    priority: "medium",
  });
  const [searchTerm, setSearchTerm] = useState(""); // New state
  const [selectedDepartment, setSelectedDepartment] = useState("all"); // New state
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user");
    }
  };

  const { data: tickets = [] } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => base44.entities.SupportTicket.filter({ user_email: user?.email }, "-created_date", 20),
    enabled: !!user,
  });

  const createTicketMutation = useMutation({
    mutationFn: (ticketData) => base44.entities.SupportTicket.create({
      ...ticketData,
      user_email: user?.email,
      status: "open",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
      setFormData({ subject: "", message: "", category: "general", priority: "medium" });
      setShowNewTicket(false);
      alert("Support ticket created successfully!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createTicketMutation.mutate(formData);
  };

  const statusConfig = {
    open: { icon: Clock, color: "text-blue-600", bg: "bg-blue-100", label: "Open" },
    in_progress: { icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-100", label: "In Progress" },
    resolved: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", label: "Resolved" },
    closed: { icon: CheckCircle, color: "text-gray-600", bg: "bg-gray-100", label: "Closed" },
  };

  // FAQ Data
  const faqData = {
    trips: [
      {
        question: "How do I request a ride?",
        answer: "Open the app, enter your destination, select vehicle type, and confirm. A driver will be assigned automatically."
      },
      {
        question: "Can I cancel a ride?",
        answer: "Yes, you can cancel before the driver arrives. Cancellation after driver dispatch may incur a fee."
      },
      {
        question: "How do I view my ride history?",
        answer: "Go to 'My Trips' to see all your past rides including dates, routes and costs."
      },
      {
        question: "What if I forgot something in the vehicle?",
        answer: "Contact the driver directly through the app within 24 hours or report a lost item in Support."
      }
    ],
    payments: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept credit/debit cards, PayPal, Apple Pay, Google Pay, and cash."
      },
      {
        question: "How do I request a refund?",
        answer: "Go to Ride History, select the trip, and tap 'Request Refund'. Our team reviews within 24-48 hours."
      },
      {
        question: "Can I get a receipt?",
        answer: "Yes, receipts are automatically sent to your email. You can also download from Ride History."
      },
      {
        question: "How does surge pricing work?",
        answer: "Prices may vary based on demand, traffic and weather. You'll always see the estimated cost before confirming."
      }
    ],
    account: [
      {
        question: "How do I change my password?",
        answer: "Go to Profile > Change Password. Enter your current password and new password twice."
      },
      {
        question: "Can I have multiple profiles?",
        answer: "Each account is linked to one profile. For corporate use, consider a business account."
      },
      {
        question: "How do I delete my account?",
        answer: "Go to Settings > Account > Delete Account. This is permanent and deletes all ride history."
      },
      {
        question: "How do I update my personal information?",
        answer: "You can update name, phone, email and profile photo in Settings > Profile anytime."
      }
    ],
    drivers: [
      {
        question: "How do I become a driver?",
        answer: "Visit 'Drive with JoltCab' and complete registration. You'll need valid license, vehicle, insurance and background check."
      },
      {
        question: "How much can I earn?",
        answer: "Earnings vary by city, hours worked and demand. Drivers average $15-25/hour after expenses."
      },
      {
        question: "What are vehicle requirements?",
        answer: "Vehicle must be under 10 years old, 4 doors, pass safety inspection, and have valid insurance."
      },
      {
        question: "How do I receive payments?",
        answer: "Payments deposit automatically to your bank account weekly. Instant cashout available for small fee."
      }
    ],
    safety: [
      {
        question: "What safety measures are in place?",
        answer: "All drivers undergo background checks, GPS tracks every trip, and we have an emergency button in the app."
      },
      {
        question: "How do I report a safety issue?",
        answer: "Use the emergency button during the trip, or report in Support > Safety after the trip."
      },
      {
        question: "Can I share my trip?",
        answer: "Yes, you can share your live location with trusted contacts during the ride via 'Share Trip'."
      },
      {
        question: "Do you verify drivers?",
        answer: "Yes, all drivers pass criminal background checks, driving record review and document validation."
      }
    ],
    general: [
      {
        question: "What cities do you operate in?",
        answer: "JoltCab operates in over 100 cities worldwide. Check availability in the app."
      },
      {
        question: "Do I need internet?",
        answer: "Yes, you need internet connection to request rides and use most features. Mobile data or WiFi recommended."
      },
      {
        question: "Is service available 24/7?",
        answer: "Yes, JoltCab is available 24 hours a day, 7 days a week in most cities."
      },
      {
        question: "How do I calculate trip cost?",
        answer: "Enter your destination in the app before requesting and you'll see estimated cost based on distance, time and demand."
      }
    ]
  };

  const departments = [
    { id: "trips", name: "Trips", icon: MapPin, color: "bg-blue-100 text-blue-600", description: "Requests, cancellations, route changes" },
    { id: "payments", name: "Payments", icon: CreditCard, color: "bg-green-100 text-green-600", description: "Payment methods, refunds, billing" },
    { id: "account", name: "Account", icon: User, color: "bg-purple-100 text-purple-600", description: "Profile, settings, security" },
    { id: "drivers", name: "Drivers", icon: Car, color: "bg-yellow-100 text-yellow-600", description: "Registration, requirements, earnings" },
    { id: "safety", name: "Safety", icon: Shield, color: "bg-red-100 text-red-600", description: "Reports, emergencies, privacy" },
    { id: "general", name: "General", icon: HelpCircle, color: "bg-gray-100 text-gray-600", description: "General questions about JoltCab" },
  ];

  // Filter FAQs
  const getFilteredFAQs = () => {
    let faqs = [];
    
    if (selectedDepartment === "all") {
      Object.values(faqData).forEach(dept => faqs.push(...dept));
    } else {
      faqs = faqData[selectedDepartment] || [];
    }

    if (searchTerm) {
      faqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return faqs;
  };

  const filteredFAQs = getFilteredFAQs();


  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#15B46A] to-[#0F9456] rounded-3xl p-8 text-white shadow-xl">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-white/90 mb-6">How can we help you today?</p>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search in FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 text-lg bg-white text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Phone</p>
            <p className="font-semibold text-gray-900">+1 (470) 748-4747</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="font-semibold text-blue-600">support@joltcab.com</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Hours</p>
            <p className="font-semibold text-gray-900">24/7 Available</p>
          </CardContent>
        </Card>
      </div>

      {/* Departments */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Support Departments</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => {
            const Icon = dept.icon;
            const isSelected = selectedDepartment === dept.id;
            
            return (
              <Card
                key={dept.id}
                className={`cursor-pointer hover:shadow-lg transition-all ${
                  isSelected ? "ring-2 ring-[#15B46A] shadow-lg" : ""
                }`}
                onClick={() => setSelectedDepartment(isSelected ? "all" : dept.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${dept.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{dept.name}</h3>
                      <p className="text-sm text-gray-600">{dept.description}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isSelected ? "rotate-90" : ""}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* FAQs */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Frequently Asked Questions
            {selectedDepartment !== "all" && (
              <span className="text-[#15B46A] ml-2">
                - {departments.find(d => d.id === selectedDepartment)?.name}
              </span>
            )}
          </h2>
          {selectedDepartment !== "all" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDepartment("all")}
            >
              Show All
            </Button>
          )}
        </div>

        {filteredFAQs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No FAQs found. Try a different search term or department.</p>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="single" collapsible className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="bg-white rounded-lg border shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-left">
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {/* New Ticket Form */}
      <AnimatePresence>
        {showNewTicket && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Create New Support Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="payment">Payment Issue</SelectItem>
                          <SelectItem value="ride_issue">Ride Issue</SelectItem>
                          <SelectItem value="account">Account Problem</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Priority</label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => setFormData({ ...formData, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input
                      placeholder="Brief description of your issue"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      placeholder="Please provide details about your issue..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="min-h-32"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewTicket(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createTicketMutation.isLoading}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Ticket
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* My Tickets */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            My Support Tickets
          </CardTitle>
          <Button
            onClick={() => setShowNewTicket(!showNewTicket)}
            className="bg-purple-600 hover:bg-purple-700"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No support tickets yet</p>
              <Button
                onClick={() => setShowNewTicket(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Create Your First Ticket
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => {
                const status = statusConfig[ticket.status];
                const StatusIcon = status.icon;
                return (
                  <div
                    key={ticket.id}
                    className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:border-purple-600 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className={`w-12 h-12 ${status.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <StatusIcon className={`w-6 h-6 ${status.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">{ticket.subject}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${status.bg} ${status.color} font-medium whitespace-nowrap`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{ticket.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="capitalize">{ticket.category.replace('_', ' ')}</span>
                        <span>•</span>
                        <span className="capitalize">{ticket.priority} priority</span>
                        <span>•</span>
                        <span>{new Date(ticket.created_date).toLocaleDateString()}</span>
                      </div>
                      {ticket.admin_response && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-1">Admin Response:</p>
                          <p className="text-sm text-gray-600">{ticket.admin_response}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Chat Component */}
      <AIChat role={user?.role || "user"} />
    </div>
  );
}
