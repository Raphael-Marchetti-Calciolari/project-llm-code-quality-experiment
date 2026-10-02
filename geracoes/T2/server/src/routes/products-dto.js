export function toDto({ _id, ...rest }) {
  return { id: String(_id), ...rest };
}
