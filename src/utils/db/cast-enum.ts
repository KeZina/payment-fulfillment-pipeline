export function castEnum<T extends string | number>(
  initialEnum: Record<string, T>,
) {
  return Object.values(initialEnum) as unknown as [T, ...T[]];
}
