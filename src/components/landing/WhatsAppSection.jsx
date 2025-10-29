import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function WhatsAppSection({ t }) {
  // Convert features object to array
  const features = [
    { title: t.features?.instant || "Instant Quotes", desc: t.features?.instantDesc || "Get fare estimates immediately" },
    { title: t.features?.easy || "Super Easy", desc: t.features?.easyDesc || "Just send your location and destination" },
    { title: t.features?.support || "24/7 Support", desc: t.features?.supportDesc || "We're always here to help" }
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-[#15B46A] to-[#0F9456] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <div className="inline-block mb-4">
              <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {t.badge || "WhatsApp Booking"}
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              {t.title || "Book a Ride in Seconds"}
            </h2>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {t.subtitle || "No app download needed. Just text us on WhatsApp."}
            </p>

            <div className="space-y-4 mb-10">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-[#15B46A]" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">{feature.title}</p>
                    <p className="text-white/80">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              size="lg"
              className="rounded-full bg-white text-[#15B46A] hover:bg-gray-100 px-10 py-6 text-lg shadow-2xl"
              onClick={() => window.open("https://wa.me/14707484747?text=Hello%20JoltCab,%20I%20need%20a%20ride", "_blank")}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {t.cta || "Start on WhatsApp"}
            </Button>

            <p className="mt-6 text-white/70 text-sm">
              Also message us at: <span className="font-semibold">+1 (470) 748-4747</span>
            </p>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <div className="w-full max-w-sm mx-auto">
                <div className="bg-white rounded-[3rem] p-4 shadow-2xl">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-[2.5rem] p-8 min-h-[600px] flex flex-col">
                    <div className="space-y-4">
                      <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-md max-w-[80%]">
                        <p className="text-sm text-gray-900">
                          Hi! I need a taxi from downtown to the north zone
                        </p>
                        <p className="text-xs text-gray-500 mt-1">10:23 AM</p>
                      </div>
                      
                      <div className="bg-[#15B46A] text-white rounded-2xl rounded-tr-sm p-4 shadow-md max-w-[80%] ml-auto">
                        <p className="text-sm">
                          Perfect! I can take you for $12. Is that okay?
                        </p>
                        <p className="text-xs text-white/70 mt-1">10:24 AM ✓✓</p>
                      </div>

                      <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-md max-w-[80%]">
                        <p className="text-sm text-gray-900">
                          Sure! I accept 👍
                        </p>
                        <p className="text-xs text-gray-500 mt-1">10:24 AM</p>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="bg-white rounded-full p-4 flex items-center gap-2 shadow-md">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          className="flex-1 bg-transparent outline-none text-sm"
                          disabled
                        />
                        <MessageCircle className="w-5 h-5 text-[#15B46A]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}