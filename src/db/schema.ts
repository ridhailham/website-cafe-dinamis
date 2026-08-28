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
  alamat: text("alamat").notNull().default(""),
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

export const adminCredentials = pgTable("admin_credentials", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().default(""),
  passwordHash: text("password_hash").notNull(),
  resetKeyHash: text("reset_key_hash").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const loginAttempts = pgTable("login_attempts", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  ip: text("ip").notNull().default(""),
  failedAt: timestamp("failed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type MenuItem = typeof menuItems.$inferSelect;
export type NewMenuItem = typeof menuItems.$inferInsert;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type NewGalleryItem = typeof galleryItems.$inferInsert;
export type Bisnis = typeof bisnis.$inferSelect;
export type NewBisnis = typeof bisnis.$inferInsert;
export type JamBuka = typeof jamBuka.$inferSelect;
export type NewJamBuka = typeof jamBuka.$inferInsert;
export type AdminCredential = typeof adminCredentials.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type LoginAttempt = typeof loginAttempts.$inferSelect;
