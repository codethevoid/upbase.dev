"use client";

import { Button } from "@/components/ui/button";
import { CodeXml, Plus } from "lucide-react";

export const ApiKeysClient = () => {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">API Keys</h1>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <Plus />
            <span>Create API key</span>
          </Button>
          <Button size="sm" variant="outline">
            <CodeXml />
            <span>API</span>
          </Button>
        </div>
      </div>

      <table className="w-full border-separate border-spacing-0 border-none">
        <thead className="bg-input/30">
          <tr>
            <th className="text-primary border-input h-8 w-[300px] rounded-l-md border border-r-0 px-3 text-left text-xs font-medium">
              Name
            </th>
            <th className="text-primary border-input h-8 w-[260px] border-y px-3 text-left text-xs font-medium">
              Type
            </th>
            <th className="text-primary border-input h-8 w-[336px] border-y px-3 text-left text-xs font-medium">
              Modified
            </th>
            <th className="text-primary border-input h-8 w-24 rounded-r-md border border-l-0 px-3 text-left text-xs font-medium">
              Size
            </th>
          </tr>
        </thead>
      </table>
    </>
  );
};
