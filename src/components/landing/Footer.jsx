import React from "react";
import { createPageUrl } from "@/utils";
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

export default function Footer({ language }) {
  const sections = [
    {
      title: "Company",
      links: [
        { label: "About us", href: "#" },
        { label: "Our offerings", href: "#" },
        { label: "Newsroom", href: "#" },
        { label: "Investors", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
      ]
    },
    {
      title: "Products",
      links: [
        { label: "Ride", href: "#" },
        { label: "Drive", href: createPageUrl("DriverRegister") },
        { label: "Deliver", href: "#" },
        { label: "Eat", href: "#" },
        { label: "Uber for Business", href: createPageUrl("CorporateRegister") },
        { label: "Gift cards", href: "#" },
      ]
    },
    {
      title: "Global citizenship",
      links: [
        { label: "Safety", href: "#" },
        { label: "Sustainability", href: "#" },
      ]
    },
    {
      title: "Travel",
      links: [
        { label: "Reserve", href: "#" },
        { label: "Airports", href: "#" },
        { label: "Cities", href: "#" },
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Youtube, href: "#" },
    { icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="bg-black text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-2xl font-bold">JoltCab</h3>
            <a 
              href="https://ihostcast.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-400 font-medium hover:text-[#15B46A] transition-colors"
            >
              by iHOSTcast
            </a>
          </div>
          <a href={createPageUrl("Support")} className="text-gray-400 hover:text-white transition-colors">
            Visit Help Center
          </a>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-lg mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4 mb-8">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <a
                key={index}
                href={social.href}
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>

        {/* Language & Location */}
        <div className="flex items-center gap-6 mb-8 text-sm">
          <button className="flex items-center gap-2 hover:text-gray-400 transition-colors">
            <span>🌐</span>
            <span>English</span>
          </button>
          <button className="flex items-center gap-2 hover:text-gray-400 transition-colors">
            <span>📍</span>
            <span>Atlanta</span>
          </button>
        </div>

        {/* App Download */}
        <div className="flex items-center gap-4 mb-8">
          <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/320px-Google_Play_Store_badge_EN.svg.png"
              alt="Get it on Google Play"
              className="h-10"
            />
          </a>
          <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/320px-Download_on_the_App_Store_Badge.svg.png"
              alt="Download on App Store"
              className="h-10"
            />
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p>© 2025 JoltCab Technologies Inc.</p>
              <a 
                href="https://ihostcast.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs hover:text-[#15B46A] transition-colors"
              >
                Powered by iHOSTcast
              </a>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Accessibility</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}