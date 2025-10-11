/**
 * Convert string "ddmmyy" hoặc "DD/MM/YYYY" => Date object
 * @param input - chuỗi dạng ddmmyy (vd "240925") hoặc DD/MM/YYYY (vd "24/09/2025")
 */
export const parseDateString = (input: string): Date | null => {
  if (!input) return null;

  // --- Trường hợp 1: ddmmyy (6 số) ---
  if (/^\d{6}$/.test(input)) {
    const day = parseInt(input.slice(0, 2), 10);
    const month = parseInt(input.slice(2, 4), 10) - 1;
    let year = parseInt(input.slice(4, 6), 10);

    year = year < 50 ? 2000 + year : 1900 + year;

    const date = new Date(year, month, day);
    return isValidDate(date, day, month, year) ? date : null;
  }

  // --- Trường hợp 2: DD/MM/YYYY ---
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
    const [d, m, y] = input.split("/").map(Number);
    const date = new Date(y, m - 1, d);
    return isValidDate(date, d, m - 1, y) ? date : null;
  }

  return null;
};

/** Kiểm tra tính hợp lệ của ngày */
const isValidDate = (date: Date, day: number, month: number, year: number): boolean => {
  return (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  );
};
