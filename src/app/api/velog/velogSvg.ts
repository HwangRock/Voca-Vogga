export function velogSvg(
  id: string,
  posts: { title: string; link: string; pubDate: string }[]
) {
  const cardWidth = 140;
  const cardHeight = 180;
  const gap = 18;
  const paddingLeft = 30;
  const paddingTop = 60;

  // 이미지 순서 (public 경로)
  const postitImages = [
    "/postit.png",
    "/postit2.png",
    "/postit3.png",
    "/postit.png",
    "/postit2.png",
  ];

  const visiblePosts = posts.slice(0, 5);

  // 카드 객체 생성: 개별 카드마다 텍스트 오프셋/스타일을 줄 수 있음
  const cards = visiblePosts.map((post, i) => {
    const x = paddingLeft + i * (cardWidth + gap);
    const y = paddingTop;

    // 각 카드에 대해 필요하면 개별 조정값을 넣을 수 있음
    // (예: 이미지별로 글자 자리수를 다르게 하고 싶다면 여기에서 조정)
    const perCardOverrides: Partial<{
      textYOffset: number; // 포스트잇 내부 텍스트의 세로 오프셋 (px, 카드 상단 기준)
      fontSize: number;
      lineClamp: number;
    }> = (() => {
      return { textYOffset: 68, fontSize: 16, lineClamp: 5 };
    })();

    return {
      img: postitImages[i % postitImages.length],
      x,
      y,
      width: cardWidth,
      height: cardHeight,
      title: post.title,
      link: post.link,
      date: formatPubDate(post.pubDate),
      textYOffset: perCardOverrides.textYOffset ?? 62,
      fontSize: perCardOverrides.fontSize ?? 12,
      lineClamp: perCardOverrides.lineClamp ?? 5,
    };
  });

  // 각 카드 객체를 이용해 SVG 요소 생성
  const itemsSvg = cards
    .map((card) => {
      const titleEsc = escapeXml(card.title);
      const linkEsc = escapeAttr(card.link);
      // foreignObject 내부 HTML: 카드별 폰트 크기, 라인클램프 적용
      const html = `
        <div xmlns="http://www.w3.org/1999/xhtml" style="
          width: ${card.width}px;
          height: ${card.height}px;
          display:flex;
          align-items:flex-start; /* 세로 위치는 padding으로 조절 */
          justify-content:center;
          text-align:center;
          box-sizing:border-box;
        ">
          <a href="${linkEsc}" target="_blank" style="
            display: -webkit-box;
            -webkit-line-clamp: ${card.lineClamp};
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            font-family: 'NanumJinJu', sans-serif;
            font-size: ${card.fontSize}px;
            line-height: 1.1;
            color: #0b0b0b;
            text-decoration: none;
            padding: ${card.textYOffset - 12}px 10px 0px 10px; /* 위쪽 패딩으로 vertical 위치 제어 */
            box-sizing: border-box;
          ">
            ${titleEsc}
          </a>
        </div>
      `;

      return `
        <image
          href="${card.img}"
          x="${card.x}"
          y="${card.y}"
          width="${card.width}"
          height="${card.height}"
          preserveAspectRatio="xMidYMid slice"
        />
        <foreignObject x="${card.x}" y="${card.y}" width="${card.width}" height="${card.height}">
          ${html}
        </foreignObject>
        <text x="${card.x + card.width / 2}" y="${card.y + card.height + 14}" text-anchor="middle" class="detail">
          ${escapeXml(card.date)}
        </text>
      `;
    })
    .join("");

  const totalWidth =
    paddingLeft * 2 + cards.length * cardWidth + (cards.length - 1) * gap;

  const svg = `
    <svg width="${totalWidth}" height="320" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#21985cff; stop-opacity:1" />
          <stop offset="100%" style="stop-color:#5feba5ff; stop-opacity:1" />
        </linearGradient>
      </defs>

      <style>
        .title {
          font-size: 25px;
          fill: #0b0b0b;
          font-family: "Trebuchet MS", sans-serif;
        }
        .detail {
          font-size: 15px;
          fill: #222;
          font-family: "Trebuchet MS", sans-serif;
        }
        a { text-decoration: none; }
      </style>

      <rect width="100%" height="100%" fill="url(#grad-green)" rx="20" ry="20"/>
      <text x="50%" y="28" text-anchor="middle" class="title">
        ${escapeXml(id)}'s Velog Posts
      </text>

      ${itemsSvg}
    </svg>
  `;

  return svg;
}

/* 헬퍼들 */
function formatPubDate(pubDate: string): string {
  try {
    const date = new Date(pubDate);
    if (isNaN(date.getTime())) return pubDate;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  } catch {
    return pubDate;
  }
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeAttr(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
