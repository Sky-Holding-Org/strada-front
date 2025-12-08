"use client";

import Link from "next/link";
import Image from "@/components/ui/NextImage";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import { useState } from "react";

export default function Footer() {
  const [openDrawer, setOpenDrawer] = useState<
    "faqs" | "privacy" | "terms" | null
  >(null);

  return (
    <footer className="bg-[#003344] text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8 md:mb-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4 md:mb-6">
              <Image
                src="/logo.svg"
                alt="Strada Logo"
                width={200}
                height={60}
                className="object-contain"
                sizes="(max-width: 768px) 160px, 200px"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <p className="text-gray-300 text-sm md:text-base mb-4 md:mb-6 max-w-md">
              Your trusted partner in finding the perfect property in Egypt.
              With years of experience and a commitment to excellence, we help
              you make informed real estate decisions.
            </p>
            <div className="flex gap-3 md:gap-4">
              <Link
                href="https://www.facebook.com/people/Strada-properties/61565371004923/"
                className="text-gray-300 hover:text-[#E3A325] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.instagram.com/strada.properties/"
                className="text-gray-300 hover:text-[#E3A325] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="https://eg.linkedin.com/company/strada-properties-egypt"
                className="text-gray-300 hover:text-[#E3A325] transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-base md:text-lg mb-4 md:mb-6 relative">
              <span className="relative z-10">Quick Links</span>
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-[#E3A325]"></span>
            </h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-[#E3A325] transition-colors text-sm md:text-base"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-gray-300 hover:text-[#E3A325] transition-colors text-sm md:text-base"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/developers"
                  className="text-gray-300 hover:text-[#E3A325] transition-colors text-sm md:text-base"
                >
                  Developers
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-[#E3A325] transition-colors text-sm md:text-base"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-[#E3A325] transition-colors text-sm md:text-base"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base md:text-lg mb-4 md:mb-6 relative">
              <span className="relative z-10">Information</span>
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-[#E3A325]"></span>
            </h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <button
                  onClick={() => setOpenDrawer("faqs")}
                  className="text-gray-300 hover:text-[#E3A325] transition-colors text-left text-sm md:text-base"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => setOpenDrawer("privacy")}
                  className="text-gray-300 hover:text-[#E3A325] transition-colors text-left text-sm md:text-base"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setOpenDrawer("terms")}
                  className="text-gray-300 hover:text-[#E3A325] transition-colors text-left text-sm md:text-base"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-bold text-base md:text-lg mb-4 md:mb-6 relative">
              <span className="relative z-10">Contact Us</span>
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-[#E3A325]"></span>
            </h3>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex gap-2 md:gap-3">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-[#E3A325] shrink-0 mt-1" />
                <a
                  href="https://maps.app.goo.gl/5niD4jy1occGCjxP6"
                  target="_blank"
                  className="text-gray-300 hover:text-[#E3A325] transition-colors text-sm md:text-base"
                >
                  One Kattameya, 215, Maadi Kattameya Ringroad - Cairo, Egypt
                </a>
              </li>
              <li className="flex gap-2 md:gap-3">
                <Phone className="h-4 w-4 md:h-5 md:w-5 text-[#E3A325] shrink-0" />
                <a
                  href="tel:+0201123960001"
                  className="text-gray-300 hover:text-[#E3A325] transition-colors text-sm md:text-base"
                >
                  Get in touch
                </a>
              </li>
              <li className="flex gap-2 md:gap-3">
                <Mail className="h-4 w-4 md:h-5 md:w-5 text-[#E3A325] shrink-0" />
                <a
                  href="mailto:sales@strada-properties.com"
                  className="text-gray-300 hover:text-[#E3A325] transition-colors text-sm md:text-base"
                >
                  sales@strada-properties.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm">
          <p className="text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} Strada Properties. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
