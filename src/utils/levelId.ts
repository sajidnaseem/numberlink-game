import type { Level } from '../store/api/schemas';

export function canonicalLevelString(level: Level): string {
  const sortedPairs = [...(level.pairs || [])].sort((a, b) =>
    (a.id || '').localeCompare(b.id || '')
  );
  const canonical = {
    size: level.size,
    difficulty: level.difficulty,
    pairs: sortedPairs.map((p) => ({
      id: p.id,
      color: p.color,
      start: { x: p.start.x, y: p.start.y },
      end: { x: p.end.x, y: p.end.y },
    })),
  };
  return JSON.stringify(canonical);
}

export async function sha256Hex(str: string): Promise<string> {
  const cryptoImpl =
    typeof globalThis !== 'undefined' && 'crypto' in globalThis
      ? ((globalThis as { crypto?: { subtle?: { digest: (algo: string, data: Uint8Array) => Promise<ArrayBuffer> } } }).crypto ?? null)
      : null;

  if (cryptoImpl?.subtle) {
    const buf = new TextEncoder().encode(str);
    const hash = await cryptoImpl.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  const Crypto = await import('expo-crypto');
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    str,
    { encoding: Crypto.CryptoEncoding.HEX }
  );
}

export async function getLevelId(level: Level): Promise<string> {
  const json = canonicalLevelString(level);
  const hex = await sha256Hex(json);
  return `sha256:${hex}`;
}
