import MarkdownIt from "markdown-it";

export default function (content: string) {
  const md = new MarkdownIt();
  const html = md.render(content);

  const span = document.createElement("span");
  span.innerHTML = html;

  function normalizeSpacing(node: Node): void {
    if (!node.hasChildNodes()) return;

    const children = Array.from(node.childNodes);

    for (let i = 0; i < children.length - 1; i++) {
      const current = children[i];
      const next = children[i + 1];

      const currentIsText = current?.nodeType === Node.TEXT_NODE;
      const nextIsText = next?.nodeType === Node.TEXT_NODE;

      const currentIsInline = current instanceof HTMLElement;
      const nextIsInline = next instanceof HTMLElement;

      const needSpace =
        (currentIsText || currentIsInline) &&
        (nextIsText || nextIsInline) &&
        !current.textContent?.endsWith(" ");

      if (needSpace) {
        node.insertBefore(document.createTextNode(" "), next);
      }
    }

    children.forEach(normalizeSpacing);
  }

  normalizeSpacing(span);
  return span.innerHTML;
}
