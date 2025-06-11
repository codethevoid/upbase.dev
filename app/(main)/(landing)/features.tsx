import { Plug } from "lucide-react";

export const Features = () => {
  return (
    <div className="pb-10 md:pb-16">
      {/*<div className="flex items-end justify-between border-t p-6">*/}
      {/*  <div className="space-y-3">*/}
      {/*    <h3 className="bg-gradient-to-br from-black to-zinc-600 bg-clip-text text-2xl font-medium text-transparent md:text-4xl dark:from-white dark:to-zinc-400">*/}
      {/*      Proudly open source*/}
      {/*    </h3>*/}
      {/*    <div className="mx-auto sm:max-w-[550px]">*/}
      {/*      <p className="text-muted-foreground text-left">*/}
      {/*        A simple, elegant interface that lets you start uploading files in minutes. Seamlessly*/}
      {/*        integrates into your code with SDKs for the browser and server.*/}
      {/*      </p>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div>*/}
      {/*    <Button asChild sharp className="h-10 uppercase md:h-9">*/}
      {/*      <NextLink href="/register">*/}
      {/*        View on GitHub <ChevronRight />*/}
      {/*      </NextLink>*/}
      {/*    </Button>*/}
      {/*  </div>*/}
      {/*</div>*/}
      <div className="grid w-full grid-cols-3 border-y">
        <div className="space-y-3 border-b px-4 py-6">
          <div className="text-foreground flex items-center gap-1.5">
            <Plug className="size-4" />
            <span className="text-muted-foreground text-[0.825rem]">No Config Needed</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Zero Setup, Just Upload</h3>
            <p className="text-muted-foreground text-sm">
              Skip the S3 configs and CORS issues. Restash works out of the box with minimal code.
            </p>
          </div>
        </div>
        <div className="space-y-3 border-b border-l px-4 py-6">
          <div className="text-foreground flex items-center gap-1.5">
            <Plug className="size-4" />
            <span className="text-muted-foreground text-[0.825rem]">Global Reach</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Worldwide File Delivery</h3>
            <p className="text-muted-foreground text-sm">
              Serve your assets from CloudFront’s edge network for lightning-fast performance
              everywhere.
            </p>
          </div>
        </div>
        <div className="space-y-3 border-b border-l px-4 py-6">
          <div className="text-foreground flex items-center gap-1.5">
            <Plug className="size-4" />
            <span className="text-muted-foreground text-[0.825rem]">Browser-Friendly</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Direct Browser Uploads</h3>
            <p className="text-muted-foreground text-sm">
              Let users upload files straight from the browser using our lightweight client SDK.
            </p>
          </div>
        </div>
        <div className="space-y-3 px-4 py-6">
          <div className="text-foreground flex items-center gap-1.5">
            <Plug className="size-4" />
            <span className="text-muted-foreground text-[0.825rem]">Server-Side Power</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Seamless Server Uploads</h3>
            <p className="text-muted-foreground text-sm">
              Upload files from your backend with our secure and flexible server SDK.
            </p>
          </div>
        </div>
        <div className="space-y-3 border-l px-4 py-6">
          <div className="text-foreground flex items-center gap-1.5">
            <Plug className="size-4" />
            <span className="text-muted-foreground text-[0.825rem]">Developer-First</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Built for Modern Devs</h3>
            <p className="text-muted-foreground text-sm">
              Designed with a simple API and SDKs that get out of your way, so you can focus on
              building.
            </p>
          </div>
        </div>
        <div className="space-y-3 border-l px-4 py-6">
          <div className="text-foreground flex items-center gap-1.5">
            <Plug className="size-4" />
            <span className="text-muted-foreground text-[0.825rem]">All File Types</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Universal File Support</h3>
            <p className="text-muted-foreground text-sm">
              Upload and serve images, videos, fonts, documents, or any static asset with ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
