
import React from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, Clock, Shield, Star, Download, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function PassengerSection({ t }) {
  const benefitIcons = [DollarSign, Clock, Shield, Star];

  return (
    <section id="passengers" className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4">
              <span className="bg-[#15B46A]/10 text-[#15B46A] px-4 py-2 rounded-full text-sm font-semibold">
                {t.badge}
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t.title}
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t.subtitle}
            </p>

            <div className="space-y-6 mb-10">
              {t.benefits.map((benefit, index) => {
                const Icon = benefitIcons[index];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-[#15B46A]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#15B46A]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="rounded-full bg-[#15B46A] hover:bg-[#0F9456] text-white px-8 shadow-lg"
                onClick={() => window.open("https://wa.me/14707484747?text=Hello%20JoltCab,%20I%20need%20a%20ride", "_blank")}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {t.cta.whatsapp}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8"
                onClick={() => window.open("#", "_blank")}
              >
                <Download className="w-5 h-5 mr-2" />
                {t.cta.download}
              </Button>
            </div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative">
              <div className="w-full h-[500px] bg-gradient-to-br from-[#15B46A]/10 to-blue-50 rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-9xl">📱</span>
              </div>
              
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-10 -left-10 bg-white p-5 rounded-2xl shadow-xl"
              >
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#15B46A]">$12.50</p>
                  <p className="text-sm text-gray-600">Your price</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
