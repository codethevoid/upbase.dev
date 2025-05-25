"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { feedbackSchema, type FeedbackSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ButtonLoader } from "@/components/ui/button-loader";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const FeedbackPopover = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, reset, watch } = useForm<FeedbackSchema>({
    resolver: zodResolver(feedbackSchema),
  });

  const onSubmit = async (data: FeedbackSchema) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error("Failed to send feedback");
        return;
      }

      toast.success("Thank you for your feedback!");
      reset();
    } catch (e) {
      console.error(e);
      toast.error("Failed to send feedback");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) reset();
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="text-muted-foreground">
          Feedback
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" collisionPadding={16}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-2">
            <Textarea placeholder={"Your feedback..."} className="h-24" {...register("message")} />
          </div>
          <div className="bg-input/10 flex justify-between border-t p-2.5">
            <div className="flex gap-0.5">
              <Button
                size="icon"
                variant={watch("emotion") === "happy" ? "secondary" : "ghost"}
                className={cn(
                  "text-muted-foreground hover:text-foreground rounded-full",
                  watch("emotion") === "happy" && "text-foreground",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  setValue("emotion", "happy");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-[18px]"
                >
                  <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM7 13H9C9 14.6569 10.3431 16 12 16C13.6569 16 15 14.6569 15 13H17C17 15.7614 14.7614 18 12 18C9.23858 18 7 15.7614 7 13ZM8 11C7.17157 11 6.5 10.3284 6.5 9.5C6.5 8.67157 7.17157 8 8 8C8.82843 8 9.5 8.67157 9.5 9.5C9.5 10.3284 8.82843 11 8 11ZM16 11C15.1716 11 14.5 10.3284 14.5 9.5C14.5 8.67157 15.1716 8 16 8C16.8284 8 17.5 8.67157 17.5 9.5C17.5 10.3284 16.8284 11 16 11Z"></path>
                </svg>
              </Button>
              <Button
                size="icon"
                variant={watch("emotion") === "sad" ? "secondary" : "ghost"}
                className={cn(
                  "text-muted-foreground hover:text-foreground rounded-full",
                  watch("emotion") === "sad" && "text-foreground",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  setValue("emotion", "sad");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-[18px]"
                >
                  <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM7 17C7 14.2386 9.23858 12 12 12C14.7614 12 17 14.2386 17 17H15C15 15.3431 13.6569 14 12 14C10.3431 14 9 15.3431 9 17H7ZM8 11C7.17157 11 6.5 10.3284 6.5 9.5C6.5 8.67157 7.17157 8 8 8C8.82843 8 9.5 8.67157 9.5 9.5C9.5 10.3284 8.82843 11 8 11ZM16 11C15.1716 11 14.5 10.3284 14.5 9.5C14.5 8.67157 15.1716 8 16 8C16.8284 8 17.5 8.67157 17.5 9.5C17.5 10.3284 16.8284 11 16 11Z"></path>
                </svg>
              </Button>
            </div>
            <Button size="sm" type="submit" className="w-[58px]" disabled={isLoading}>
              {isLoading ? <ButtonLoader /> : "Send"}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};
