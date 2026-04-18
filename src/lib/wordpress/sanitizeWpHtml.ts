import sanitizeHtml from "sanitize-html";

/** Sanitize WordPress post HTML for in-app rendering (server-side). */
export function sanitizeWpPostHtml(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "figure",
      "figcaption",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "iframe",
      "span",
      "div",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "srcset", "alt", "title", "width", "height", "loading", "class"],
      a: ["href", "name", "target", "rel", "class"],
      iframe: ["src", "width", "height", "allow", "allowfullscreen", "loading", "title", "class"],
      "*": ["class", "id"],
    },
    allowedIframeHostnames: ["www.youtube.com", "youtube.com", "player.vimeo.com", "videopress.com"],
  });
}
