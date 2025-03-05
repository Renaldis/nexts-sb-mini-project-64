import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

// Tabel Users
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  birth_date: timestamp("birth_date", { withTimezone: true }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  hobby: text("hobby"),
  password: varchar("password", { length: 255 }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Tabel Posts
export const posts = pgTable("posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  deleted_at: timestamp("deleted_at", { withTimezone: true }),
});

// Tabel Replies
export const replies = pgTable("replies", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  post_id: integer("post_id")
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull(),
  user_id: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  deleted_at: timestamp("deleted_at", { withTimezone: true }),
});

// Tabel Likes
export const likes = pgTable("likes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  post_id: integer("post_id")
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull(),
  user_id: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Tabel Notifications
export const notifications = pgTable("notifications", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  sender_id: integer("sender_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  post_id: integer("post_id").references(() => posts.id, {
    onDelete: "cascade",
  }),
  reply_id: integer("reply_id").references(() => replies.id, {
    onDelete: "cascade",
  }),
  like_id: integer("like_id").references(() => likes.id, {
    onDelete: "cascade",
  }),
  message: text("message").notNull(),
  is_read: boolean("is_read").default(false),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  deleted_at: timestamp("deleted_at", { withTimezone: true }),
});
