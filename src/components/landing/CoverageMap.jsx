import React from "react";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function CoverageMap({ t }) {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t.title || "Available in Major Cities"}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.subtitle || "Expanding to more cities every month"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mb-12"
        >
          <div className="w-full h-[400px] lg:h-[500px] bg-gradient-to-br from-[#15B46A]/10 to-blue-50 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden relative">
            <div className="text-9xl opacity-20">🗺️</div>
            
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-20 left-1/4"
            >
              <div className="w-12 h-12 bg-[#15B46A] rounded-full flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute top-40 right-1/3"
            >
              <div className="w-12 h-12 bg-[#15B46A] rounded-full flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="absolute bottom-32 left-1/2"
            >
              <div className="w-12 h-12 bg-[#15B46A] rounded-full flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {(t.cities || []).map((city, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition-all text-center"
            >
              <MapPin className="w-6 h-6 text-[#15B46A] mx-auto mb-2" />
              <p className="font-semibold text-gray-900 text-sm">{city.name}</p>
              {city.rides && (
                <p className="text-xs text-gray-500 mt-1">{city.rides}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}