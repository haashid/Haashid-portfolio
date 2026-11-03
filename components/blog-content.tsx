import { createElement, Fragment, type ReactNode } from "react";
import Image from "next/image";

type RichNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  content?: RichNode[];
};

function safeHref(value: unknown) {
  if (typeof value !== "string") return undefined;
  return /^(https?:\/\/|mailto:|\/|#)/i.test(value) ? value : undefined;
}

function renderNode(node: RichNode, key: number): ReactNode {
  if (node.type === "text") {
    let output: ReactNode = node.text ?? "";
    for (const mark of node.marks ?? []) {
      if (mark.type === "bold" || mark.type === "strong") output = createElement("strong", { key: `${key}-strong` }, output);
      else if (mark.type === "italic" || mark.type === "em") output = createElement("em", { key: `${key}-em` }, output);
      else if (mark.type === "code") output = createElement("code", { key: `${key}-code` }, output);
      else if (mark.type === "link") {
        const href = safeHref(mark.attrs?.href);
        if (href) output = createElement("a", { key: `${key}-link`, href, rel: href.startsWith("http") ? "noreferrer" : undefined }, output);
      }
    }
    return output;
  }

  const children = (node.content ?? []).map((child, index) => renderNode(child, index));
  switch (node.type) {
    case "doc": return createElement(Fragment, { key }, ...children);
    case "paragraph": return createElement("p", { key }, ...children);
    case "heading": {
      const level = Number(node.attrs?.level);
      const tag = `h${Math.max(2, Math.min(4, Number.isInteger(level) ? level : 2))}`;
      return createElement(tag, { key }, ...children);
    }
    case "bulletList": return createElement("ul", { key }, ...children);
    case "orderedList": return createElement("ol", { key }, ...children);
    case "listItem": return createElement("li", { key }, ...children);
    case "blockquote": return createElement("blockquote", { key }, ...children);
    case "codeBlock": return createElement("pre", { key }, createElement("code", null, ...children));
    case "hardBreak": return createElement("br", { key });
    case "horizontalRule": return createElement("hr", { key });
    case "image": {
      const src = safeHref(node.attrs?.src);
      if (!src) return null;
      const width = typeof node.attrs?.width === "number" ? node.attrs.width : 1200;
      const height = typeof node.attrs?.height === "number" ? node.attrs.height : 675;
      return <Image key={key} src={src} alt={typeof node.attrs?.alt === "string" ? node.attrs.alt : ""} width={width} height={height} unoptimized />;
    }
    default: return createElement(Fragment, { key }, ...children);
  }
}

export function BlogContent({ content }: { content: string }) {
  let parsed: RichNode | null = null;
  try {
    parsed = JSON.parse(content) as RichNode;
  } catch {
    // Older plain-text posts remain readable below.
  }
  if (parsed && typeof parsed === "object" && Array.isArray(parsed.content)) {
    return <div className="article-content">{renderNode(parsed, 0)}</div>;
  }

  return (
    <div className="article-content">
      {content.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    </div>
  );
}
