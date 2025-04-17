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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export const RegisterClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    console.log(data);
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const { message } = await res.json();
        toast.error(message || "Something went wrong");
        return;
      }

      // make request to sign in with same credentials
      const signInResponse = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResponse?.error) {
        toast.error("Something went wrong");
        return;
      }

      // push to dashboard
      router.push("/storage");
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen w-full place-items-center px-4">
      <div className="w-full max-w-[400px] space-y-4 py-20">
        <Card className="w-full space-y-4 p-6">
          <div className="space-y-0.5">
            <p className="font-medium">Get started with Restash</p>
            <p className="text-smaller text-muted-foreground">
              Enter your credentials to create an account
            </p>
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
        <p className="text-smaller text-muted-foreground text-center">
          Already have an account?{" "}
          <NextLink href="/login" className="text-foreground transition-colors hover:underline">
            Sign in
          </NextLink>
        </p>
      </div>
    </div>
  );
};
