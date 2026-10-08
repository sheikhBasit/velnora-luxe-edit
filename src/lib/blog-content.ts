import { parseFragment, serialize, type DefaultTreeAdapterTypes } from "parse5";

const affiliateProductNames = new Set([
  "olaplex no. 3 plus complete repair treatment",
  "joico k-pak color therapy luster lock treatment",
]);

function getTextContent(node: DefaultTreeAdapterTypes.Node): string {
  if (node.nodeName === "#text") return node.value;
  if (!("childNodes" in node)) return "";
  return node.childNodes.map(getTextContent).join("");
}

function isSecureAffiliateUrl(href: string | undefined): href is string {
  if (!href) return false;

  try {
    return new URL(href).protocol === "https:";
  } catch {
    return false;
  }
}

export function filterBlogAffiliateLinks(html: string): string {
  const fragment = parseFragment(html.replace(/(?:&nbsp;|&#160;|\u00a0)/gi, " "));

  const visit = (parent: DefaultTreeAdapterTypes.ParentNode) => {
    let index = 0;

    while (index < parent.childNodes.length) {
      const node = parent.childNodes[index];

      if ("tagName" in node && node.tagName === "a") {
        const linkText = getTextContent(node).replace(/\s+/g, " ").trim().toLowerCase();
        const href = node.attrs.find((attribute) => attribute.name === "href")?.value;

        if (affiliateProductNames.has(linkText) && isSecureAffiliateUrl(href)) {
          node.attrs = [
            { name: "href", value: href },
            { name: "class", value: "affiliate-product-link" },
            { name: "rel", value: "sponsored nofollow noopener noreferrer" },
            { name: "target", value: "_blank" },
          ];
          visit(node);
          index += 1;
          continue;
        }

        parent.childNodes.splice(index, 1, ...node.childNodes);
        for (const child of node.childNodes) child.parentNode = parent;
        continue;
      }

      if ("childNodes" in node) visit(node);
      index += 1;
    }
  };

  visit(fragment);
  return serialize(fragment);
}
