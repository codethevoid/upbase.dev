import { ApiKeyClient } from "@/app/(dashboard)/api-keys/[id]/client";

type Params = Promise<{ id: string }>;

export default async function ApiKey({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <div className="space-y-8">
      <ApiKeyClient id={id} />
    </div>
  );
}
