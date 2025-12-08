"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Calendar, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
});

const getNext7Days = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date: date.toISOString().split("T")[0],
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      fullDate: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    });
  }
  return days;
};

const availableTimes = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

interface MeetingDrawerProps {
  side?: "left" | "right" | "top" | "bottom";
}

export function MeetingDrawer({ side = "right" }: MeetingDrawerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const days = getNext7Days();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      date: "",
      time: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, type: "meeting" }),
      });

      if (!response.ok) throw new Error("Failed to send request");

      toast.success("Meeting request sent successfully!");
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to send meeting request");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} direction={side}>
      <DrawerTrigger asChild>
        <Button className="w-full bg-white text-[#013344] border-2 border-[#05596B] hover:bg-[#05596B] hover:text-white transition-all duration-300 h-12 font-semibold shadow-md hover:shadow-lg">
          <Calendar className="mr-2 h-5 w-5" />
          Schedule a Meeting
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className={
          side === "right" || side === "left"
            ? "fixed  h-screen w-[400px] max-w-full flex flex-col"
            : "min-h-screen flex flex-col"
        }
        style={
          side === "right"
            ? { right: 0, left: "auto" }
            : side === "left"
            ? { left: 0, right: "auto" }
            : {}
        }
      >
        <DrawerHeader className="bg-linear-to-br from-[#013344] to-[#05596B] text-white">
          <DrawerTitle className="text-2xl">Schedule a Meeting</DrawerTitle>
          <DrawerDescription className="text-white/90">
            Choose your preferred date and time
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              id="meeting-form"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#013344] font-semibold">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        className="border-2 border-[#05596B]/20 focus:border-[#05596B] h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#013344] font-semibold text-sm">
                      Phone Number *
                    </FormLabel>
                    <FormControl>
                      <div className="[&_input]:h-11 [&_input]:border-2 [&_input]:border-gray-200 [&_input]:focus:border-[#05596B] [&_input]:focus:ring-2 [&_input]:focus:ring-[#05596B]/20 [&_button]:h-11 [&_button]:border-2 [&_button]:border-gray-200">
                        <PhoneInput
                          placeholder="Phone Number"
                          {...field}
                          defaultCountry="EG"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#013344] font-semibold">
                      Select Date
                    </FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {days.map((day) => (
                        <Button
                          key={day.date}
                          type="button"
                          variant={
                            field.value === day.date ? "default" : "outline"
                          }
                          className={
                            field.value === day.date
                              ? "bg-[#05596B] hover:bg-[#013344] border-2 h-auto py-3"
                              : "border-2 border-[#05596B]/20 hover:border-[#05596B] h-auto py-3"
                          }
                          onClick={() => field.onChange(day.date)}
                        >
                          <div className="text-center w-full">
                            <div className="font-bold text-sm">
                              {day.dayName}
                            </div>
                            <div className="text-xs mt-1">{day.fullDate}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#013344] font-semibold">
                      Select Time
                    </FormLabel>
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimes.map((time) => (
                        <Button
                          key={time}
                          type="button"
                          variant={field.value === time ? "default" : "outline"}
                          className={
                            field.value === time
                              ? "bg-[#05596B] hover:bg-[#013344] text-xs border-2"
                              : "border-2 border-[#05596B]/20 hover:border-[#05596B] text-xs"
                          }
                          onClick={() => field.onChange(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DrawerFooter className="border-t bg-white">
          <Button
            type="submit"
            form="meeting-form"
            className="w-full bg-linear-to-r from-[#013344] to-[#05596B] hover:from-[#05596B] hover:to-[#013344] h-11 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Request
              </>
            )}
          </Button>
          <DrawerClose asChild>
            <Button
              variant="outline"
              type="button"
              className="w-full border-2 h-11"
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
