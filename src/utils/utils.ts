export function exerciseId(input: object): string {
  const normalized = JSON.stringify(input);
  let hash = 0;

  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0; // force 32-bit
  }

  return `ex-${Math.abs(hash)}`;
}
