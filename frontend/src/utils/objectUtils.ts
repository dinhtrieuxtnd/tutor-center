/**
 * Xóa các key có value là null, undefined, '' hoặc chỉ toàn khoảng trắng
 */
export const cleanObjectStrict = <T extends Record<string, any>>(obj: T): T => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => {
      if (value === null || value === undefined) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      return true;
    })
  ) as T; // giữ nguyên type, không phải Partial
};

