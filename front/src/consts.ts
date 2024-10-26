import { TableHeader } from "./types";

export const headers: TableHeader[] = [
  { label: "Subject", sortKey: null },
  { label: "Name", sortKey: null },
  { label: "Description", sortKey: null },
  { label: "Category", sortKey: null },
  { label: "Status", sortKey: null },
  { label: "Priority", sortKey: "priority"},
  { label: "Sentiment", sortKey: "sentiment" },
  { label: "Created At", sortKey: "created_at" },
  { label: "Strategy", sortKey: null },
];
