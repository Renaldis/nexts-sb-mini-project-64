ALTER TABLE "notifications" ADD COLUMN "sender_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "type" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "post_id" integer;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "reply_id" integer;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "like_id" integer;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_reply_id_replies_id_fk" FOREIGN KEY ("reply_id") REFERENCES "public"."replies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_like_id_likes_id_fk" FOREIGN KEY ("like_id") REFERENCES "public"."likes"("id") ON DELETE cascade ON UPDATE no action;