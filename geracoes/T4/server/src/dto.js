export function toProductDto({ _id, ...rest }) {
  return { id: String(_id), ...rest };
}

export function toStoreDto({ _id, ...rest } = {}) {
  return rest;
}
