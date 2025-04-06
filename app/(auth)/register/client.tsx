"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { ButtonLoader } from "@/components/ui/button-loader";

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
});

export const RegisterClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, register, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    console.log(data);
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full px-4 grid place-items-center">
      <div className="py-20 max-w-[380px] w-full space-y-4">
        <Card className="w-full space-y-4 py-6">
          <div>
            <p className="font-medium">Get started with Upbase</p>
            <p className="text-smaller text-muted-foreground">Enter your credentials to create an account</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Input placeholder="Email" {...register("email")} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Input placeholder="Password" type="password" {...register("password")} />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>
            <Button className="w-full" disabled={isLoading} type="submit">
              {isLoading ? <ButtonLoader /> : "Create account"}
            </Button>
          </form>
        </Card>
        <p className="text-center text-smaller text-muted-foreground">Already have an account?{" "}
          <NextLink href="/login" className="underline hover:text-foreground transition-colors">Sign in</NextLink>
        </p>
      </div>
    </div>
  );
};