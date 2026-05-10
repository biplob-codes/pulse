export type SortParam = "newest" | "top" | "oldest";
export type StatusParam =
  | "UNDER_REVIEW"
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CLOSED";

const VALID_SORTS: SortParam[] = ["newest", "top", "oldest"];
const VALID_STATUSES: StatusParam[] = [
  "UNDER_REVIEW",
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CLOSED",
];

export function parseSort(value: string | undefined): SortParam {
  return VALID_SORTS.includes(value as SortParam)
    ? (value as SortParam)
    : "newest";
}

export function parseStatus(
  value: string | undefined,
): StatusParam | undefined {
  return VALID_STATUSES.includes(value as StatusParam)
    ? (value as StatusParam)
    : undefined;
}
