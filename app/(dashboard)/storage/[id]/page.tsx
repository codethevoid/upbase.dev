import { StorageObjectClient } from "@/app/(dashboard)/storage/[id]/client";

type Params = Promise<{ id: string }>;

export default async function ObjectPage({ params }: { params: Params }) {
  const { id } = await params;
  return <StorageObjectClient id={id} />;
}
