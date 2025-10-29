import React from "react";
import { Smartphone, DollarSign, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorks({ t }) {
  const stepIcons = [Smartphone, DollarSign, Shield];
  const stepColors = ["bg-blue-500", "bg-[#15B46A]", "bg-purple-500"];

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {t.steps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                  {/* Step number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-20 h-20 ${stepColors[index]} rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connecting arrow */}
                {index < t.steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-[#15B46A] to-transparent"></div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}