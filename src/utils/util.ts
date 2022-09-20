import dayjs from "dayjs";
export function defaultTimeFormat(row: number, col: number, callValue: any) {
  return dayjs(callValue).format("YYYY-MM-DD");
}