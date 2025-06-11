import { Plug } from "lucide-react";

export const Pricing = () => {
  return (
    <div className="mx-auto max-w-screen-xl space-y-8 px-6">
      <div className="space-y-4">
        <div className="text-foreground flex items-center justify-center gap-1.5">
          <Plug className="size-4" />
          <span className="text-muted-foreground text-[0.825rem]">Straightforward pricing</span>
        </div>
        <div className="space-y-3">
          <h3 className="bg-gradient-to-br from-black to-zinc-600 bg-clip-text text-center text-2xl font-medium text-transparent md:text-4xl dark:from-white dark:to-zinc-400">
            Simple pricing
          </h3>
          <div className="mx-auto sm:max-w-[550px]">
            <p className="text-muted-foreground text-center">
              A simple, elegant interface that lets you start uploading files in minutes. Seamlessly
              integrates into your code with SDKs for the browser and server.
            </p>
          </div>
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-4xl border"></div>
    </div>
  );
};
