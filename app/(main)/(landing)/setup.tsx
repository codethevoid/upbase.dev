"use client";

import { Globe, Plug, Server } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/utils";

const clientCode = `"use client";

import { createRestashUploader } from "@restash/client";
import { FormEvent } from "react";

const upload = createRestashUploader({ publicKey: "pk_xxx" });

export const ImageUploader = () => {

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    const result = await upload(file);
    console.log(result.url) // https://cdn.restash.io/xxx
  };

  return (
    <>
      <h1>Upload an image</h1>
      <form onSubmit={onSubmit}>
        <input name="file" type="file" required accept="image/*" />
        <button type="submit">Upload</button>
      </form>
    </>
  );
};`;

const serverCode = `import { NextResponse, NextRequest } from "next/server";
import { Restash } from "@restash/node";

const restash = new Restash(process.env.RESTASH_SECRET_KEY);

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const upload = await restash.files.upload(file);

  // store the upload in your db or do something else with it
  console.log(upload.url);

  return NextResponse.json(upload);
};`;

export const Setup = () => {
  const [tab, setTab] = useState<"client" | "server">("client");

  return (
    <div className="mx-auto max-w-screen-xl space-y-8 border-t px-6 py-10 md:px-10 md:py-16">
      <div className="space-y-4">
        {/*<div className="flex justify-center">*/}
        {/*  <CodeXml className="text-muted-foreground size-6" />*/}
        {/*</div>*/}
        <div className="text-foreground flex items-center justify-center gap-1.5">
          <Plug className="size-4" />
          <span className="text-muted-foreground text-[0.825rem]">Easy integration</span>
        </div>
        <div className="space-y-3">
          <h3 className="bg-gradient-to-br from-black to-zinc-600 bg-clip-text text-center text-2xl font-medium text-transparent md:text-4xl dark:from-white dark:to-zinc-400">
            Integrate in minutes
          </h3>
          <div className="mx-auto sm:max-w-[550px]">
            <p className="text-muted-foreground text-center">
              A simple, elegant interface that lets you start uploading files in minutes. Seamlessly
              integrates into your code with SDKs for the browser and server.
            </p>
          </div>
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-4xl border">
        <div className="flex border-b">
          <button
            className={cn(
              "flex h-14 w-full cursor-pointer items-center justify-center gap-2 border-r text-xs font-medium uppercase transition-colors md:text-[.825rem]",
              tab === "client"
                ? "text-foreground bg-secondary/20"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setTab("client")}
          >
            <Globe className="size-4" />
            <p>Client uploads</p>
          </button>
          <button
            className={cn(
              "flex h-14 w-full cursor-pointer items-center justify-center gap-2 text-xs font-medium uppercase transition-colors md:text-[.825rem]",
              tab === "server"
                ? "text-foreground bg-secondary/20"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setTab("server")}
          >
            <Server className="size-4" />
            <span>Server uploads</span>
          </button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 rounded-none bg-gradient-to-br from-teal-300 via-teal-300/70 to-cyan-300 opacity-5 blur-lg"></div>
          <div className="absolute inset-0 rounded-none bg-gradient-to-br from-zinc-300 via-zinc-300/70 to-cyan-300 opacity-5"></div>
          <div className="dark:from-background/90 dark:to-background/90 dark:via-background/30 overflow-x-auto bg-gradient-to-br p-4 backdrop-blur-xl">
            <CodeBlock code={tab === "client" ? clientCode : serverCode} />
          </div>
        </div>
      </div>
    </div>
  );
};
