/* eslint-disable @typescript-eslint/no-explicit-any -- untyped mdast/hast nodes in the custom remark/rehype plugins below */
/**
 * Markdown → HTML renderer for paper notes.
 *
 * A plain remark/rehype pipeline (no MDX) so LaTeX braces never collide with
 * JSX. Supports: GFM, `$math$` (KaTeX), fenced code (Shiki, dual light/dark),
 * anchored headings, Obsidian `[[wikilinks]]`, and `> [!note]` callouts.
 *
 * Server-only. Returns an HTML string injected via `dangerouslySetInnerHTML`.
 */
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { buildResolver, type ResolvedLink } from "./notes";

type Resolver = (target: string) => ResolvedLink;

/** remark plugin: turn `[[target]]` / `[[target|label]]` into links. */
function remarkWikilinks(resolve: Resolver) {
  return () => (tree: any) => {
    visit(tree, "text", (node: any, index: number | undefined, parent: any) => {
      if (!parent || index == null || typeof node.value !== "string") return;
      if (!node.value.includes("[[")) return;

      const value: string = node.value;
      const children: any[] = [];
      const re = /\[\[([^\]]+)\]\]/g;
      let last = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(value))) {
        if (m.index > last) {
          children.push({ type: "text", value: value.slice(last, m.index) });
        }
        const [rawTarget, rawLabel] = m[1].split("|");
        const label = (rawLabel ?? rawTarget).trim();
        const r = resolve(rawTarget.trim());
        children.push({
          type: "link",
          url: r.href,
          title: r.exists ? r.title : `${label} (no note yet)`,
          data: {
            hProperties: {
              className: r.exists ? ["wikilink"] : ["wikilink", "wikilink-missing"],
            },
          },
          children: [{ type: "text", value: label }],
        });
        last = m.index + m[0].length;
      }
      if (last < value.length) children.push({ type: "text", value: value.slice(last) });

      parent.children.splice(index, 1, ...children);
      return index + children.length;
    });
  };
}

const CALLOUT_LABELS: Record<string, string> = {
  note: "Note",
  info: "Info",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
  danger: "Danger",
  quote: "Quote",
  question: "Question",
  key: "Key idea",
  math: "Intuition",
};

/** rehype plugin: Obsidian callouts — `> [!type] Optional title`. */
function rehypeCallouts() {
  return (tree: any) => {
    visit(tree, "element", (node: any) => {
      if (node.tagName !== "blockquote") return;
      const firstP = node.children.find(
        (c: any) => c.type === "element" && c.tagName === "p",
      );
      const firstText = firstP?.children?.[0];
      if (!firstText || firstText.type !== "text") return;

      const raw: string = firstText.value;
      const nl = raw.indexOf("\n");
      const firstLine = nl === -1 ? raw : raw.slice(0, nl);
      const rest = nl === -1 ? "" : raw.slice(nl + 1);
      const match = /^\[!(\w+)\]([+-]?)\s*(.*)$/.exec(firstLine);
      if (!match) return;

      const type = match[1].toLowerCase();
      const titleText = match[3]?.trim() || CALLOUT_LABELS[type] || type;

      // Drop the marker line from the body, keeping any inline remainder.
      firstText.value = rest;
      if (!rest && firstP.children.length === 1) {
        node.children = node.children.filter((c: any) => c !== firstP);
      }

      node.tagName = "div";
      node.properties = { className: ["callout", `callout-${type}`] };
      node.children.unshift({
        type: "element",
        tagName: "div",
        properties: { className: ["callout-title"] },
        children: [{ type: "text", value: titleText }],
      });
    });
  };
}

const prettyCodeOptions: PrettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark-dimmed" },
  keepBackground: false,
};

export async function renderMarkdown(content: string): Promise<string> {
  const resolve = buildResolver();
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkWikilinks(resolve))
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: { className: ["heading-anchor"] },
    })
    .use(rehypeCallouts)
    .use(rehypeKatex, { strict: false })
    .use(rehypePrettyCode, prettyCodeOptions)
    .use(rehypeStringify)
    .process(content);
  return String(file);
}
