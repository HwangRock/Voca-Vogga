export function velogSvg(id: String, posts: { title: string; link: string, pubDate: string }[]){
    const itemsSvg = posts
    .map((post, i) => {
      const formattedDate = formatPubDate(post.pubDate); 
      return `
        <a href="${post.link}" target="_blank">
          <text x="2%" y="${30 + i * 15}%" class="comment">
             🔶 ${post.title}
          </text> 
        </a>
        <a>
         <text x="85%" y="${30 + i * 15}%" class="detail">
            ${formattedDate}
          </text> 
        </a>
      `;
    })
    .join("");

    const svg = `
      <svg width="700" height="250" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#21985cff; stop-opacity:1" />
            <stop offset="100%" style="stop-color:#5feba5ff; stop-opacity:1" />
          </linearGradient>
        </defs>
        <style>
          .title {
            font-size: 24px;
            fill: #0b0b0bff;
            font-family: "Trebuchet MS", sans-serif;
          }
          .comment {
            font-size: 15px;
            fill: #ffffff;
            font-family: "Trebuchet MS", sans-serif;
            cursor: pointer;
          }
          .detail{
            font-size: 13px;
            fill: #292928ff;
            font-family: "Trebuchet MS", sans-serif;
          }
        </style>
        <rect width="100%" height="100%" fill="url(#grad-green)" rx="20" ry="20"/>
        <text x="50%" y="15%" text-anchor="middle" class="title">
          ${id}'s velog post
        </text>
        ${itemsSvg}
      </svg>
    `;

    return svg;
}

// pubDate 문자열을 'YYYY.MM.DD' 형식으로 변환
function formatPubDate(pubDate: string): string {
  try {
    const date = new Date(pubDate);
    if (isNaN(date.getTime())) return pubDate; // 변환 실패 시 원본 반환

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  } catch {
    return pubDate;
  }
}
