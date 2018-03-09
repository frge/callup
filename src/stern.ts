
export function stern(src: string, start: number): number {
  const quote = src[start];

  let prevCharIsBackslash = false;
  let at = start;
  let ch;

  while (ch = src[++at]) {
    if (ch === '\\') {
      prevCharIsBackslash = !prevCharIsBackslash;
      continue;
    }

    // end
    if (ch === quote && !prevCharIsBackslash) {
      return at;
    }

    prevCharIsBackslash = false;
  }

  return -1;
}
