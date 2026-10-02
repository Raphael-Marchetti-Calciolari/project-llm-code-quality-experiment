export const pick = (source, fields) =>
  Object.fromEntries(fields.filter((f) => source?.[f] !== undefined).map((f) => [f, source[f]]));
