
import React from "react";
import { Button } from "@/components/ui/button";
import { Radio, MapPin, Clock, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function DispatcherSection({ t }) {
  const benefitIcons = [Radio, MapPin, Clock, DollarSign];

  return (
    <section id="dispatcher" className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-white">
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
              <span className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-semibold">
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
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-gray-900" />
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

            <Button
              size="lg"
              className="rounded-full bg-gray-900 hover:bg-gray-800 text-white px-10 shadow-lg"
              onClick={() => alert("Dispatcher registration form coming soon")}
            >
              {t.cta}
            </Button>
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
              <div className="w-full h-[500px] bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-9xl">🎯</span>
              </div>
              
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-10 -right-10 bg-white p-5 rounded-2xl shadow-xl"
              >
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">200+</p>
                  <p className="text-sm text-gray-600">Rides/day</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
