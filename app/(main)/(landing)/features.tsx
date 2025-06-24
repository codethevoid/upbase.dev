import { CloudUpload, CodeXml, Cog, Folder, Globe2, TerminalSquare } from "lucide-react";
import { Crosses } from "@/components/ui/crosses";

export const Features = () => {
  return (
    <div className="relative">
      <Crosses />
      <div className="w-full border-y lg:grid lg:grid-cols-3">
        <div className="space-y-3 border-b p-6">
          <div className="text-foreground flex items-center gap-1.5">
            <Cog className="size-4" />
            <span className="text-muted-foreground text-[0.825rem]">No config needed</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Minimal setup</h3>
            <p className="text-muted-foreground text-sm">
              Restash works out of the box with no configuration required. Just plug in your api
              key.
            </p>
          </div>
        </div>
        <div className="space-y-3 border-b p-6 lg:border-l">
          <div className="text-foreground flex items-center gap-1.5">
            <Globe2 className="size-4" />
            <span className="text-muted-foreground text-[0.825rem]">Super fast, global cdn</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Serve your assets from the edge</h3>
            <p className="text-muted-foreground text-sm">
              Serve your assets from CloudFront’s edge network for lightning-fast performance
              everywhere.
            </p>
          </div>
        </div>
        <div className="space-y-3 border-b p-6 lg:border-l">
          <div className="text-foreground flex items-center gap-1.5">
            <CloudUpload className="size-4" />
            <span className="text-muted-foreground text-[0.825rem]">Client-side power</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Direct Browser Uploads</h3>
            <p className="text-muted-foreground text-sm">
              Upload any file from the browser with our simple and flexible client SDK for
              Javascript.
            </p>
          </div>
        </div>
        <div className="space-y-3 border-b p-6 lg:border-none">
          <div className="text-foreground flex items-center gap-1.5">
            <TerminalSquare className="size-4" />
            <span className="text-muted-foreground text-[0.825rem]">Server-side power</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Manage files from the server</h3>
            <p className="text-muted-foreground text-sm">
              Upload, retrieve, and delete files from your server with our SDK for Node.js.
            </p>
          </div>
        </div>
        <div className="space-y-3 border-b p-6 lg:border-b-0 lg:border-l">
          <div className="text-foreground flex items-center gap-1.5">
            <CodeXml className="size-4" />
            <span className="text-muted-foreground text-[0.825rem]">Developer first</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Built for developers</h3>
            <p className="text-muted-foreground text-sm">
              Restash was built with the goal to make object storage simple and easy to setup and
              use.
            </p>
          </div>
        </div>
        <div className="space-y-3 p-6 lg:border-l">
          <div className="text-foreground flex items-center gap-1.5">
            <Folder className="size-4" />
            <span className="text-muted-foreground text-[0.825rem]">All file types</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Universal File Support</h3>
            <p className="text-muted-foreground text-sm">
              Upload and serve images, videos, fonts, documents, or any other static asset with
              ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
