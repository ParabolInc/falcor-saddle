function defSerializer(obj) {
  if (typeof obj === 'boolean' ||
      typeof obj === 'number' ||
      typeof obj === 'string' ||
      typeof obj === 'undefined' ||
      (typeof obj === 'object' && obj === null)) {
    return obj;
  }
  // Fallback to JSON serialization:
  return JSON.stringify(obj);
}

export default function serialize(obj, serializer = defSerializer) {
  return serializer(obj);
}
