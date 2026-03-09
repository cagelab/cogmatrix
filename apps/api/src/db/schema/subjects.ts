import { pgTable, timestamp, text } from "drizzle-orm/pg-core";

import { baseColumns } from "./base-columns";

export const subjects = pgTable("subjects", {
  ...baseColumns,
  nickname: text("nickname").notNull(),
});
