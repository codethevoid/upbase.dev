"use client";

import { Button } from "@/components/ui/button";
import { CodeXml, Key } from "lucide-react";
import { CreateApiKeyDialog } from "@/components/dialogs/create-api-key";
import { useApiKeys } from "@/hooks/swr/use-api-keys";
import { Skeleton } from "@/components/ui/skeleton";
import NextLink from "next/link";
import { Card } from "@/components/ui/card";

export const ApiKeysClient = () => {
  const { keys, isLoading, error } = useApiKeys();

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">API Keys</h1>
        <div className="flex items-center gap-2">
          <CreateApiKeyDialog />
          <Button size="sm" variant="outline">
            <CodeXml />
            <span>API</span>
          </Button>
        </div>
      </div>

      {isLoading || (keys && keys.length > 0) ? (
        <div className="max-w-full overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 border-none whitespace-nowrap">
            <thead className="bg-input/30">
              <tr>
                <th className="text-primary border-input h-8 rounded-l-md border border-r-0 px-3 text-left text-xs font-medium">
                  Name
                </th>
                <th className="text-primary border-input h-8 border-y px-3 text-left text-xs font-medium">
                  Token
                </th>
                <th className="text-primary border-input h-8 border-y px-3 text-left text-xs font-medium">
                  Last used
                </th>
                <th className="text-primary border-input h-8 rounded-r-md border border-l-0 px-3 text-left text-xs font-medium">
                  Created
                </th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody>
                {Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index}>
                    <td className="border-b px-3 py-3.5">
                      <Skeleton className="h-2" />
                    </td>
                    <td className="border-b px-3 py-3.5">
                      <Skeleton className="h-2" />
                    </td>
                    <td className="border-b px-3 py-3.5">
                      <Skeleton className="h-2" />
                    </td>
                    <td className="border-b px-3 py-3.5">
                      <Skeleton className="h-2" />
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                {keys?.map((key) => (
                  <tr key={key.id}>
                    <td className="border-b px-3 py-2.5 text-sm">
                      <div className="flex items-center gap-4">
                        {/*<Checkbox />*/}
                        <div className="ring-offset-background flex size-[26px] shrink-0 items-center justify-center rounded-md bg-gradient-to-bl from-zinc-100 to-zinc-300 ring-1 ring-zinc-300 ring-offset-2 dark:from-zinc-500 dark:to-zinc-900 dark:ring-zinc-400">
                          <Key className="size-3.5" />
                        </div>
                        <NextLink
                          href={`/api-keys/${key.id}`}
                          className="hover:border-primary dark:hover:border-primary truncate border-b border-dashed border-zinc-400 transition-colors dark:border-zinc-600"
                        >
                          {key.name}
                        </NextLink>
                      </div>
                    </td>
                    <td className="border-b px-3 py-2.5 text-sm">{key.secretKey}</td>
                    <td className="border-b px-3 py-2.5 text-sm">
                      {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : "Never"}
                    </td>
                    <td className="border-b px-3 py-2.5 text-sm">
                      {new Date(key.createdAt).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      ) : (
        <Card className={"flex h-48 w-full items-center justify-center"}>
          <p>No API keys found</p>
        </Card>
      )}
    </>
  );
};
