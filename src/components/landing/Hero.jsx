import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Download, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero({ t }) {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#15B46A]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#15B46A]/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block mb-6"
            >
              <span className="bg-[#15B46A]/10 text-[#15B46A] px-6 py-2 rounded-full text-sm font-semibold">
                {t.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              {t.title}{" "}
              <span className="text-[#15B46A]">{t.titleHighlight}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed"
            >
              {t.subtitle}{" "}
              <span className="font-semibold text-gray-900">{t.subtitleHighlight}</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="rounded-full bg-[#15B46A] hover:bg-[#0F9456] text-white px-8 py-6 text-lg shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 transition-all"
                onClick={() => window.open("https://wa.me/14707484747?text=Hello%20JoltCab,%20I%20need%20a%20ride", "_blank")}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {t.cta.whatsapp}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-6 text-lg transition-all"
                onClick={() => window.open("#", "_blank")}
              >
                <Download className="w-5 h-5 mr-2" />
                {t.cta.download}
              </Button>
            </motion.div>

            {/* App Store Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-8 flex gap-4 justify-center lg:justify-start"
            >
              <a href="#" className="opacity-90 hover:opacity-100 transition-opacity">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/320px-Download_on_the_App_Store_Badge.svg.png"
                  alt="Download on App Store"
                  className="h-12"
                />
              </a>
              <a href="#" className="opacity-90 hover:opacity-100 transition-opacity">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/320px-Google_Play_Store_badge_EN.svg.png"
                  alt="Get it on Google Play"
                  className="h-12"
                />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-10 flex items-center gap-8 justify-center lg:justify-start text-sm text-gray-600"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#15B46A] rounded-full"></div>
                <span>{t.features.safe}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#15B46A] rounded-full"></div>
                <span>{t.features.fair}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#15B46A] rounded-full"></div>
                <span>{t.features.available}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main illustration placeholder */}
              <div className="w-full h-[600px] bg-gradient-to-br from-[#15B46A]/20 to-[#15B46A]/5 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-10 right-10 w-32 h-32 bg-white/60 rounded-full blur-xl"></div>
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#15B46A]/20 rounded-full blur-2xl"></div>
                
                {/* Taxi illustration */}
                <div className="relative z-10">
                  <div className="w-64 h-64 bg-gradient-to-br from-[#15B46A] to-[#0F9456] rounded-full flex items-center justify-center shadow-2xl">
                    <span className="text-8xl">🚖</span>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-10 -left-10 bg-white p-4 rounded-2xl shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#15B46A]/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Your Price</p>
                    <p className="text-xs text-gray-600">Negotiate the fare</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-10 -right-10 bg-white p-4 rounded-2xl shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#15B46A]/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Verified Drivers</p>
                    <p className="text-xs text-gray-600">Travel safely</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}