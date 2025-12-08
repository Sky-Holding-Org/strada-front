"use client";

import Link from "next/link";
import Image from "@/components/ui/NextImage";
import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { useFavorites } from "@/contexts/favorites-context";
import {
  Menu,
  Home,
  Search,
  Users,
  Phone,
  Rocket,
  MapPinned,
  HardHat,
  Heart,
  PhoneIcon,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { count } = useFavorites();

  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationLinks = [
    { href: "/", icon: Home, label: "Home" },
    {
      href: "/search",
      icon: Search,
      label: "Search",
    },
    {
      href: "/new-launches",
      icon: Rocket,
      label: "New Launches",
    },
    {
      href: "/egypt-map",
      icon: Users,
      label: "Strada Map",
    },
    {
      href: "/about",
      icon: Users,
      label: "About Us",
    },
    // {
    //   href: "/areas",
    //   icon: MapPinned,
    //   label: "Destinations",
    // },
    // {
    //   href: "/developers",
    //   icon: HardHat,
    //   label: "Developers",
    // },

    {
      href: "/contact",
      icon: Phone,
      label: "Contact Us",
    },
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? "bg-white/95 shadow-md backdrop-blur-sm"
          : "bg-linear-to-b from-[#003344]/95 to-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="relative flex items-center transition-transform hover:scale-105"
            aria-label="Go to homepage"
          >
            <Image
              src={isScrolled ? "/LogoD.svg" : "/logo.svg"}
              alt="Strada Logo"
              width={120}
              height={40}
              style={{ width: "auto", height: "auto", maxHeight: "40px" }}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navigationLinks.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors duration-200 py-2 ${
                    isActive
                      ? "text-[#E3A325]"
                      : isScrolled
                      ? "text-[#003344] hover:text-[#E3A325]"
                      : "text-white hover:text-[#E3A325]"
                  }`}
                >
                  <span className="relative group">
                    {item.label}
                    <span
                      className={`absolute inset-x-0 -bottom-1 h-0.5 bg-[#E3A325] transition-transform duration-200 ${
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Favorites and CTAs (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/favorites"
              className={`relative p-2 rounded-full transition-colors duration-200 ${
                isScrolled
                  ? "text-[#003344] hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="View favorites"
            >
              <Heart className="h-6 w-6" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E3A325] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            {/* WhatsApp CTA */}
            <Button
              className="bg-green-500 hover:bg-green-600 text-white gap-2"
              size="sm"
              asChild
            >
              <a
                href="https://wa.me/201123960001?text=Hi%2C%20I%27m%20interested%20in%20your%20properties"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact us on WhatsApp"
              >
                <FaWhatsapp className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>

            {/* Call Us CTA */}
            <Button
              className="bg-[#E3A325] hover:bg-[#d39822] text-white gap-2"
              size="sm"
              asChild
            >
              <a href="tel:+1234567890" aria-label="Call us">
                <PhoneIcon className="h-4 w-4" />
                Call Us
              </a>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    isScrolled
                      ? "text-[#003344] hover:bg-gray-100"
                      : "text-white hover:bg-white/10"
                  }`}
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[350px] bg-white"
              >
                <SheetHeader className="border-b pb-4">
                  <SheetTitle className="text-left">
                    <Link href="/" className="flex items-center">
                      <div className="relative h-10 aspect-square">
                        <Image
                          src="/LogoD.svg"
                          alt="Strada Logo"
                          fill
                          sizes="40px"
                          className="object-contain"
                          priority
                        />
                      </div>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav
                  className="flex flex-col mt-8"
                  aria-label="Mobile navigation"
                >
                  <SheetClose asChild>
                    <Link
                      href="/favorites"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 relative"
                    >
                      <Heart className="h-5 w-5" />
                      <span>Favorites</span>
                      {count > 0 && (
                        <span className="ml-auto bg-[#E3A325] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {count}
                        </span>
                      )}
                    </Link>
                  </SheetClose>

                  {navigationLinks.map(({ href, icon: Icon, label }) => {
                    const isActive =
                      pathname === href ||
                      (href !== "/" && pathname.startsWith(href));

                    return (
                      <SheetClose asChild key={href}>
                        <Link
                          href={href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                            isActive
                              ? "text-[#E3A325] bg-[#E3A325]/10"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{label}</span>
                        </Link>
                      </SheetClose>
                    );
                  })}

                  {/* Mobile CTAs */}
                  <div className="mt-8 px-4 space-y-3">
                    <div className="flex gap-2">
                      <Button
                        asChild
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white gap-2"
                        size="sm"
                      >
                        <a
                          href="https://wa.me/201123960001?text=Hi%2C%20I%27m%20interested%20in%20your%20properties"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaWhatsapp className="h-4 w-4" />
                          WhatsApp
                        </a>
                      </Button>
                      <Button
                        asChild
                        className="flex-1 bg-[#E3A325] hover:bg-[#d39822] text-white gap-2"
                        size="sm"
                      >
                        <a href="tel:+1234567890">
                          <PhoneIcon className="h-4 w-4" />
                          Call Us
                        </a>
                      </Button>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
