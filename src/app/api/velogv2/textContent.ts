export const FIXED_PHRASES = {
  memoLine1: "떠든 사람",
  memoLine3: "잘 꾸미는 햇감자",
  memoLine4: "잘 만드는 황록",
  memo2: "모두 화이팅 ~~ S2",
  memo3Line1: "주번",
  memo3Line2: "~햇감자~",
  titleSuffix: "'s Velog Posts",
} as const;

export function memoLine2(id: string): string {
  return `멋있는 ${id}`;
}

export function titleText(id: string): string {
  return `${id}${FIXED_PHRASES.titleSuffix}`;
}
