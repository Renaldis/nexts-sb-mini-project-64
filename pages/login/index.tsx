import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(2).max(50),
});

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
    </div>
  );
}
