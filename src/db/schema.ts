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

export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  gambarUrl: text("gambar_url").notNull(),
  alt: text("alt").notNull().default(""),
  urutan: integer("urutan").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const bisnis = pgTable("bisnis", {
  id: serial("id").primaryKey(),
  waNomor: text("wa_nomor").notNull().default(""),
  waTeks: text("wa_teks").notNull().default(""),
  mapsEmbed: text("maps_embed").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const jamBuka = pgTable("jam_buka", {
  id: serial("id").primaryKey(),
  hari: text("hari").notNull(),
  jam: text("jam").notNull(),
  urutan: integer("urutan").notNull().default(0),
});

export type MenuItem = typeof menuItems.$inferSelect;
export type NewMenuItem = typeof menuItems.$inferInsert;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type NewGalleryItem = typeof galleryItems.$inferInsert;
export type Bisnis = typeof bisnis.$inferSelect;
export type NewBisnis = typeof bisnis.$inferInsert;
export type JamBuka = typeof jamBuka.$inferSelect;
export type NewJamBuka = typeof jamBuka.$inferInsert;
