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
  password: z.string().min(1, { message: "Please enter your password" }),
});

export const LoginClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { handleSubmit, register, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true);
    try {

      const signInResponse = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResponse?.error) {
        toast.error("Invalid email or password");
        return;
      }

      // push to dashboard
      router.push("/storage");
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="min-h-screen w-full px-4 grid place-items-center">
      <div className="py-20 max-w-[400px] w-full space-y-4">
        <Card className="w-full space-y-4 p-6 ">
          <div className="space-y-0.5">
            <p className="font-medium">Sign in to your Upbase account</p>
            <p className="text-smaller text-muted-foreground">Enter your credentials to continue
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
              {isLoading ? <ButtonLoader /> : "Sign in"}
            </Button>
          </form>
        </Card>
        <p className="text-center text-smaller text-muted-foreground">Don&apos; have an
                                                                      account?{" "}
          <NextLink
            href="/register" className="hover:underline text-foreground transition-colors"
          >Register</NextLink>
        </p>
      </div>
    </div>
  );
};