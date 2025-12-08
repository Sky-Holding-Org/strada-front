"use client";

import { useRef, useEffect, useState } from "react";
import {
  Percent,
  Calendar,
  Tag,
  ChevronLeft,
  ChevronRight,
  BadgePercent,
  Bookmark,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PaymentPlan {
  id: number;
  paymentPercentage: number;
  paymentDuration: number;
  paymentType: string;
  payment_name?: string;
  isActive: boolean;
}

interface PaymentPlansProps {
  plans: PaymentPlan[];
}

export function PaymentPlans({ plans }: PaymentPlansProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    ref?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      ref?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [plans]);

  const useSlider = plans.length > 4;

  return (
    <div className="relative">
      {useSlider ? (
        <>
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {plans.map((plan) => (
              <div key={plan.id} className="shrink-0 w-64">
                <PaymentCard plan={plan} />
              </div>
            ))}
          </div>
          {canScrollLeft && (
            <button
              onClick={() =>
                scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" })
              }
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full",
                "bg-white/90 backdrop-blur-md border shadow-lg",
                "hover:bg-white transition-all hover:scale-110"
              )}
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() =>
                scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" })
              }
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full",
                "bg-white/90 backdrop-blur-md border shadow-lg",
                "hover:bg-white transition-all hover:scale-110"
              )}
            >
              <ChevronRight size={20} />
            </button>
          )}
        </>
      ) : (
        <div className="flex gap-4 flex-wrap">
          {plans.map((plan) => (
            <div key={plan.id} className="w-64">
              <PaymentCard plan={plan} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PaymentCard({ plan }: { plan: PaymentPlan }) {
  const isOffer = plan.payment_name?.toLowerCase() === "offer";

  if (isOffer) {
    return (
      <div className="p-4 bg-linear-to-br bg-white border border-border rounded-lg hover:shadow-lg transition-all relative overflow-hidden h-full">
        <Badge className="absolute top-2 right-2 bg-yellow-600 text-xs">
          <Tag className="w-3 h-3 mr-1" />
          Offer
        </Badge>
        <div className="flex items-start gap-2">
          <BadgePercent className="w-4 h-4 text-yellow-600 shrink-0" />
          <div className="flex-1">
            {plan.payment_name && (
              <p className="text-xs font-bold text-yellow-600 uppercase tracking-wide">
                {plan.payment_name}
              </p>
            )}
            <p className="font-semibold text-sm text-yellow-600">
              {plan.paymentType}
            </p>
            <div className="space-y-1 mt-2">
              <div className="flex items-center gap-2 text-xs">
                <Percent className="w-3 h-3 text-yellow-600 shrink-0" />
                <span className="font-bold">{plan.paymentPercentage}%</span>
                <span className="text-muted-foreground">Down</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="w-3 h-3 text-yellow-600 shrink-0" />
                <span className="font-bold">{plan.paymentDuration}</span>
                <span className="text-muted-foreground">Years</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border border-border rounded-lg hover:border-primary hover:shadow-md transition-all h-full">
      <div className="flex items-start gap-2">
        <Bookmark className="w-4 h-4 text-primary shrink-0" />
        <div className="flex-1">
          {plan.payment_name && (
            <p className="text-xs font-bold text-primary uppercase tracking-wide">
              {plan.payment_name}
            </p>
          )}
          <p className="font-semibold text-sm">{plan.paymentType}</p>
          <div className="space-y-1 mt-2">
            <div className="flex items-center gap-2 text-xs">
              <Percent className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="font-bold">{plan.paymentPercentage}%</span>
              <span className="text-muted-foreground">Down</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="font-bold">{plan.paymentDuration}</span>
              <span className="text-muted-foreground">Years</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
