"use client";

import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

import { Button } from "@/components/ui/button";

interface ContactButtonsProps {
  phoneNumber: string;
  compoundName: string;
}

export function ContactButtons({
  phoneNumber,
  compoundName,
}: ContactButtonsProps) {
  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in ${compoundName}. Can you provide more details?`
  );
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(
    /\D/g,
    ""
  )}?text=${whatsappMessage}`;

  return (
    <div className="flex gap-3">
      <Button
        asChild
        className="flex-1 bg-[#E9E8E9] hover:bg-[#E9E8E9]/60 text-[#05596B] text-xl font-bold"
        size="lg"
      >
        <a href={`tel:${phoneNumber}`}>
          <Phone className="mr-2 size-7" />
          Call Us
        </a>
      </Button>
      <Button
        asChild
        className="flex-1 bg-green-400 hover:bg-green-700 text-xl font-bold"
        size="lg"
      >
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <FaWhatsapp className="size-7 mr-2" />
          WhatsApp
        </a>
      </Button>
    </div>
  );
}
