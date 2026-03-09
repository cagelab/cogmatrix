import { pgTable, timestamp } from "drizzle-orm/pg-core";

import { baseColumns } from "./base-columns";

export const sessionsTable = pgTable("sessions", {
  ...baseColumns,
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
});
