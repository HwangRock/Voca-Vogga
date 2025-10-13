export function velogSvg(
  id: string,
  posts: { title: string; link: string; pubDate: string }[],
  opts?: { inlineImages?: string[]; inlineFontDataUri?: string }
) {
  const cardWidth = 140;
  const cardHeight = 180;
  const gap = 18;
  const paddingLeft = 30;
  const paddingTop = 60;

  const defaultPostit = [
    "/postit.png",
    "/postit2.png",
    "/postit3.png",
    "/postit.png",
    "/postit2.png",
  ];

  const postitImages = opts?.inlineImages ?? defaultPostit;

  const base = (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_BASE_URL)
    ? String(process.env.NEXT_PUBLIC_BASE_URL).replace(/\/$/, "")
    : "";

  const fontPath = opts?.inlineFontDataUri
    ? opts.inlineFontDataUri
    : base
      ? `${base}/font/NanumJinJuBagGyeongACe.ttf`
      : "/font/NanumJinJuBagGyeongACe.ttf";

  const visiblePosts = posts.slice(0, 5);

  const cards = visiblePosts.map((post, i) => {
    const x = paddingLeft + i * (cardWidth + gap);
    const y = paddingTop;

    const perCardOverrides = { textYOffset: 68, fontSize: 16, lineClamp: 5 };

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
      fontSize: perCardOverrides.fontSize ?? 18,
      lineClamp: perCardOverrides.lineClamp ?? 5,
    };
  });

  const itemsSvg = cards
    .map((card) => {
      const titleEsc = escapeXml(card.title);
      const linkEsc = escapeAttr(card.link);
      const html = `
        <div xmlns="http://www.w3.org/1999/xhtml" style="
          width: ${card.width}px;
          height: ${card.height}px;
          display:flex;
          align-items:flex-start;
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
            font-size: 19px;
            line-height: 1.1;
            color: #0b0b0b;
            text-decoration: none;
            padding: ${card.textYOffset - 12}px 10px 0px 10px;
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
        @font-face {
          font-family: 'NanumJinJu';
          src: url('${fontPath}') format('truetype');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        .title {
          font-size: 25px;
          fill: #d1d0d0ff;
          font-family: "Comic Sans MS", "Chalkboard SE", "Bradley Hand", "Segoe Print", cursive;
        }
        .detail {
          font-size: 12px;
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
