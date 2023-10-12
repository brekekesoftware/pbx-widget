export const wrap = <T>(data: T | T[]) => (Array.isArray(data) ? data : [data]);

export const unique = <T>(data: T[], by: (value: T) => string) => {
  const mapped = data.reduce((map, value) => {
    const key = by(value);
    if (!map.has(key)) map.set(key, value);
    return map;
  }, new Map<string, T>());

  return [...mapped.values()];
};
