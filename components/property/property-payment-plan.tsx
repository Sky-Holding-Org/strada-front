"use client";

import { useRef, useEffect, useState } from "react";
import {
  Percent,
  Calendar,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentPlan {
  title: string;
  down_payment: string;
  monthly_payment: number;
  duration_years: number;
}

interface PropertyPaymentPlanProps {
  plan: PaymentPlan;
}

export function PropertyPaymentPlan({ plan }: PropertyPaymentPlanProps) {
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border max-w-sm">
      <h3 className="text-base font-bold mb-3 text-[#05596B]">{plan.title}</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-2">
            <Percent className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Down Payment</p>
              <p className="font-semibold text-sm">
                {formatPrice(plan.down_payment)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 mr-4">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-semibold text-sm">
                {plan.duration_years} Years
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Wallet className="w-4 h-4 text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Monthly Payment</p>
            <p className="font-semibold text-sm">
              {formatPrice(plan.monthly_payment)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
