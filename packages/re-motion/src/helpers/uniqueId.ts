var _uniqueId = 0;

export function uniqueId() {
  return String(_uniqueId++);
}
