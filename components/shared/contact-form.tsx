"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "../ui/phone-input";
import { toast } from "sonner";
import { MeetingDrawer } from "./meeting-drawer";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  location: z.string().min(1, "Please select a location"),
  message: z.string().optional(),
});

interface ContactFormProps {
  initialAreas?: { id: number; name: string; slug: string }[];
}

export default function ContactForm({ initialAreas = [] }: ContactFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [areas, setAreas] = useState(initialAreas);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      location: "",
      message: "",
    },
  });

  useEffect(() => {
    if (initialAreas.length === 0) {
      async function fetchAreas() {
        try {
          setIsLoadingAreas(true);
          const response = await fetch("/api/areas");
          const data = await response.json();
          setAreas(data || []);
        } catch (error) {
          console.error("Failed to fetch areas", error);
        } finally {
          setIsLoadingAreas(false);
        }
      }
      fetchAreas();
    }
  }, [initialAreas]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, type: "contact" }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      toast.success("Message sent successfully! We'll contact you soon.");
      form.reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-0 shadow-2xl bg-white backdrop-blur-sm overflow-hidden">
      <CardHeader className=" text-[#013344] ">
        <CardTitle className="text-3xl font-bold">Get in Touch</CardTitle>
        <p className="text-[#013344] text-sm">
          We&apos;ll respond within 24 hours
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#013344] font-semibold text-sm">
                    Full Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-11 border-2 border-gray-200 focus:border-[#05596B] focus:ring-2 focus:ring-[#05596B]/20 transition-all"
                      placeholder="Enter your name"
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-[#013344] font-semibold text-sm">
                    Preferred Location *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingAreas}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-[#05596B] focus:ring-2 focus:ring-[#05596B]/20 w-full">
                        <SelectValue
                          placeholder={
                            isLoadingAreas
                              ? "Loading locations..."
                              : "Select a location"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full">
                      {isLoadingAreas ? (
                        <div className="flex items-center justify-center py-2">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Loading...
                        </div>
                      ) : areas.length > 0 ? (
                        areas.map((area) => (
                          <SelectItem key={area.id} value={area.slug}>
                            {area.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-locations" disabled>
                          No locations available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#013344] font-semibold text-sm">
                    Message
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your requirements..."
                      className="resize-none border-2 border-gray-200 focus:border-[#05596B] focus:ring-2 focus:ring-[#05596B]/20 h-32 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                className="w-full h-12 bg-linear-to-r from-[#013344] to-[#05596B] hover:from-[#05596B] hover:to-[#013344] transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or</span>
                </div>
              </div>

              <MeetingDrawer side="right" />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
