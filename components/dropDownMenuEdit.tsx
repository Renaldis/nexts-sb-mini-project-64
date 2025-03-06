import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import EditPostDialog from "@/pages/update";
import { mutate } from "swr";
import { toast } from "react-toastify";
import type { Post } from "@/types";

export default function DropDownMenuEdit({
  postId,
  currentContent,
}: {
  postId: number;
  currentContent: Post;
}) {
  const [open, setOpen] = useState(false);
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/posts/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Gagal menghapus post");
      mutate("/api/posts?type=all");
      mutate("/api/posts?type=me");
      toast.success("Post deleted successfully!", {
        autoClose: 1000,
        position: "top-center",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Terjadi kesalahan saat menghapus post.");
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer">
          <Button variant="ghost" size="icon" asChild>
            <MoreHorizontal size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditPostDialog
        postId={postId}
        currentContent={currentContent}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}
