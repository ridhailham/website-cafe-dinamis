import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  nama: text("nama").notNull(),
  deskripsi: text("deskripsi").notNull().default(""),
  harga: integer("harga").notNull(),
  kategori: text("kategori").notNull().default("Kopi"),
  urutan: integer("urutan").notNull().default(0),
  gambarUrl: text("gambar_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type MenuItem = typeof menuItems.$inferSelect;
export type NewMenuItem = typeof menuItems.$inferInsert;
