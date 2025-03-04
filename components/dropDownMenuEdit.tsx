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
import { useSWRConfig } from "swr";
import { toast } from "react-toastify";

interface Post {
  id: number;
  content: string;
  created_at: string;
  user_id: number;
}

export default function DropDownMenuEdit({
  postId,
  currentContent,
}: {
  postId: number;
  currentContent: Post;
}) {
  const [open, setOpen] = useState(false);
  const { mutate } = useSWRConfig();
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
      toast.success("Post deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat menghapus post.");
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
