"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { ChevronRight, Globe, Plug, SquareTerminal } from "lucide-react";
import { Crosses } from "@/components/ui/crosses";
import NextLink from "next/link";
import { track } from "@vercel/analytics";

const signatureCode = `import { NextResponse } from "next/server";
import { generateSig } from "@restash/client";

// Only needed for client side uploads
export const GET = () => {
  const secret = process.env.RESTASH_SECRET_KEY!;
  const { signature, payload } = generateSig(secret);

  return NextResponse.json({ signature, payload });
};
`;

const restashCode = `import { Restash } from "@restash/node"; 
import { createRestashUploader } from "@restash/client";

// For server side usage
export const restash = new Restash(process.env.RESTASH_SECRET_KEY);

// For client side usage
export const upload = createRestashUploader({
  publicKey: "pk_xxx",
  handleSignature: "/api/signature",
});`;

const formCode = `import { upload } from "@/lib/restash";

const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
  const formData = new FormData(e.currentTarget);
  const file = formData.get("file") as File;

  const { url } = await upload(file, {
    onProgress: ({ percent }) => {
      console.log(percent);
    }
  });

  console.log(url); // https://cdn.restash.io/xxx
};`;

const restashServerCode = `import { restash } from "@/lib/restash";

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const result = await restash.files.upload(file);

  // save to db or do something else with it
  await db.user.update({ avatar: result.url });

  return NextResponse.json(result);
};`;

export const CodeExamples = () => {
  const [firstBlock, setFirstBlock] = useState<"client" | "server">("client");

  return (
    <div className="relative mx-auto max-w-screen-xl">
      <div className="relative h-12 border-b">
        <Crosses />
      </div>
      <div className="lg:grid lg:grid-cols-2">
        <div className="col-span-1 self-center p-6 lg:p-10">
          <div className="space-y-4">
            <div className="text-foreground flex items-center gap-1.5 md:justify-start">
              <Plug className="size-4" />
              <span className="text-muted-foreground text-[0.825rem]">Easy integration</span>
            </div>
            <div className="space-y-3">
              <h3 className="bg-gradient-to-br from-black to-zinc-600 bg-clip-text text-2xl font-medium text-transparent md:text-4xl dark:from-white dark:to-zinc-400">
                Get setup in minutes
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                A simple interface that lets you start uploading files in a few lines of code. Use
                our SDKs to integrate with your favorite Javascript framework.
              </p>
            </div>
            <Button
              asChild
              className="rounded-full"
              onClick={() => track("Get your api keys", { location: "code-examples" })}
            >
              <NextLink href="/register">
                Get your api keys <ChevronRight />
              </NextLink>
            </Button>
          </div>
        </div>
        <div className="col-span-1 border-t border-dashed p-4 lg:border-t-0 lg:border-l">
          <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-lg border">
            <div className="relative">
              <div className="absolute inset-0 rounded-none opacity-5 blur-lg dark:bg-gradient-to-br dark:from-sky-300 dark:via-sky-300/70 dark:to-blue-300"></div>
              <div className="absolute inset-0 rounded-none opacity-5 dark:bg-gradient-to-br dark:from-zinc-300 dark:via-zinc-300/70 dark:to-blue-300"></div>
              <div className="dark:from-background/90 dark:to-background/90 dark:via-background/30 overflow-x-auto bg-gradient-to-br p-4 backdrop-blur-xl">
                <div className="mb-4 space-y-4">
                  <div className="flex space-x-1.5">
                    <span className="size-2.5 rounded-full border bg-red-500/10"></span>
                    <span className="size-2.5 rounded-full border bg-yellow-500/10"></span>
                    <span className="size-2.5 rounded-full border bg-green-500/10"></span>
                  </div>
                  <div className="flex space-x-1.5">
                    <Button
                      variant={firstBlock === "client" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-6.5 rounded-full px-2.5 text-[0.765rem] font-normal"
                      onClick={() => setFirstBlock("client")}
                    >
                      restash.ts
                    </Button>
                    <Button
                      variant={firstBlock === "server" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-6.5 rounded-full px-2.5 text-[0.765rem] font-normal"
                      onClick={() => setFirstBlock("server")}
                    >
                      route.ts
                    </Button>
                  </div>
                </div>
                <CodeBlock code={firstBlock === "client" ? restashCode : signatureCode} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex flex-col-reverse border-y lg:grid lg:grid-cols-2">
        <Crosses />
        <div className="col-span-1 border-t border-dashed p-4 lg:border-t-0">
          <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-lg border">
            <div className="relative">
              <div className="absolute inset-0 rounded-none opacity-5 blur-lg dark:bg-gradient-to-br dark:from-sky-300 dark:via-sky-300/70 dark:to-blue-300"></div>
              <div className="absolute inset-0 rounded-none opacity-5 dark:bg-gradient-to-br dark:from-zinc-300 dark:via-zinc-300/70 dark:to-blue-300"></div>
              <div className="dark:from-background/90 dark:to-background/90 dark:via-background/30 overflow-x-auto bg-gradient-to-br p-4 backdrop-blur-xl">
                <div className="mb-4 space-y-4">
                  <div className="flex space-x-1.5">
                    <span className="size-2.5 rounded-full border bg-red-500/10"></span>
                    <span className="size-2.5 rounded-full border bg-yellow-500/10"></span>
                    <span className="size-2.5 rounded-full border bg-green-500/10"></span>
                  </div>
                </div>
                <CodeBlock code={formCode} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 h-full items-center border-dashed p-6 lg:flex lg:border-l lg:p-10">
          <div className="space-y-4">
            <div className="text-foreground flex items-center gap-1.5 md:justify-start">
              <Globe className="size-4" />
              <span className="text-muted-foreground text-[0.825rem]">Client side SDK</span>
            </div>
            <div className="space-y-3">
              <h3 className="bg-gradient-to-br from-black to-zinc-600 bg-clip-text text-2xl font-medium text-transparent md:text-4xl dark:from-white dark:to-zinc-400">
                Easy browser uploads
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Start uploading files with realtime progress tracking directly from the browser. No
                need to send your files to the server.
              </p>
            </div>
            <Button
              asChild
              className="rounded-full"
              onClick={() => track("Start for free", { location: "code-examples" })}
            >
              <NextLink href="/register">
                Start for free <ChevronRight />
              </NextLink>
            </Button>
          </div>
        </div>
      </div>
      <div className="lg:grid lg:grid-cols-2">
        <div className="col-span-1 self-center p-6 lg:p-10">
          <div className="space-y-4">
            <div className="text-foreground flex items-center gap-2">
              <SquareTerminal className="size-4" />
              <span className="text-muted-foreground text-[0.825rem]">Server side SDK</span>
            </div>
            <div className="space-y-3">
              <h3 className="bg-gradient-to-br from-black to-zinc-600 bg-clip-text text-2xl font-medium text-transparent md:text-4xl dark:from-white dark:to-zinc-400">
                Server side management
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Upload, retrieve, and manage files in your storage using our Node.js SDK,
                streamlining file handling directly from your server.
              </p>
            </div>
            <Button
              asChild
              className="rounded-full"
              onClick={() => track("Start uploading", { location: "code-examples" })}
            >
              <NextLink href="/register">
                Start uploading <ChevronRight />
              </NextLink>
            </Button>
          </div>
        </div>
        <div className="col-span-1 border-t border-dashed p-4 lg:border-t-0 lg:border-l">
          <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-lg border">
            <div className="relative">
              <div className="absolute inset-0 rounded-none opacity-5 blur-lg dark:bg-gradient-to-br dark:from-sky-300 dark:via-sky-300/70 dark:to-blue-300"></div>
              <div className="absolute inset-0 rounded-none opacity-5 dark:bg-gradient-to-br dark:from-zinc-300 dark:via-zinc-300/70 dark:to-blue-300"></div>
              <div className="dark:from-background/90 dark:to-background/90 dark:via-background/30 overflow-x-auto bg-gradient-to-br p-4 backdrop-blur-xl">
                <div className="mb-4 space-y-4">
                  <div className="flex space-x-1.5">
                    <span className="size-2.5 rounded-full border bg-red-500/10"></span>
                    <span className="size-2.5 rounded-full border bg-yellow-500/10"></span>
                    <span className="size-2.5 rounded-full border bg-green-500/10"></span>
                  </div>
                </div>
                <CodeBlock code={restashServerCode} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative h-12 border-t">
        <Crosses />
      </div>
    </div>
  );
};

//     <div className="relative mx-auto max-w-screen-xl border-t px-6 py-10 md:px-10 md:py-16">
