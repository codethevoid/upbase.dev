import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export const UploadProgress = ({
  isOpen,
  setIsOpen,
  uploads,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  uploads: Record<string, number>;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <Dialog open={isOpen}>
      <DialogContent className="p-0">
        {Object.values(uploads).length > 0 &&
        Object.values(uploads).every((value) => value === 100) ? (
          <>
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>Upload completed</DialogTitle>
              <DialogDescription>Your files have been uploaded successfully.</DialogDescription>
            </DialogHeader>
            <DialogFooter className="p-6 pt-0">
              <Button
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/storage?${searchParams.toString()}`);
                }}
              >
                View storage
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>Upload in progress</DialogTitle>
              <DialogDescription>
                Your files are being uploaded. Please wait until the upload is complete.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-80 p-6 pt-0">
              <div className="space-y-1">
                {Object.entries(uploads).map(([key, value]) => {
                  return (
                    <div
                      key={key}
                      className="relative flex items-center justify-between overflow-hidden rounded-md px-2.5 py-1"
                    >
                      <span
                        className="absolute top-0 left-0 -z-1 h-full bg-teal-500/10 transition-all"
                        style={{ width: `${value}%` }}
                      ></span>
                      <span className="text-smaller max-w-32 truncate">
                        {key.slice(0, key.lastIndexOf("-"))}
                      </span>
                      <span className="text-smaller">
                        {value === 100 ? <Check className="size-4" /> : `${value}%`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
