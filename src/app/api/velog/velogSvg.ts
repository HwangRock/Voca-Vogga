export function velogSvg(id: String, posts: { title: string; link: string }[]){
    const itemsSvg = posts
      .map(
        (post: { title?: string; link?: string }, i: number) => `
        <a href="${post.link}" target="_blank">
          <text x="5%" y="${30 + i * 15}%" class="comment">
            ${post.title}
          </text> 
        </a>
      `
      )
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