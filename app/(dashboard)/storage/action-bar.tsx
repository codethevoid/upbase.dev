import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Sort } from "@/app/(dashboard)/storage/client";

export const ActionBar = ({
  sortBy,
  setSortBy,
}: {
  sortBy: Sort;
  setSortBy: React.Dispatch<Sort>;
}) => {
  return (
    <div className="flex gap-2">
      <Input placeholder="Search for files..." className="h-8" />
      <Select value={sortBy} onValueChange={(value: Sort) => setSortBy(value)}>
        <SelectTrigger className="min-w-40 shrink-0" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            <SelectLabel>Sort by</SelectLabel>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
            <SelectItem value="name_desc">Name (Z-A)</SelectItem>
            <SelectItem value="size_desc">Largest</SelectItem>
            <SelectItem value="size_asc">Smallest</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button size="sm">
        <Plus />
        <span>Create folder</span>
      </Button>
      <Button size="sm">
        <Upload />
        <span>Upload</span>
      </Button>
    </div>
  );
};
