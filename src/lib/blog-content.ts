import { parseFragment, serialize, type DefaultTreeAdapterTypes } from "parse5";

const affiliateProducts = new Map([
  [
    "olaplex no. 3 plus complete repair treatment",
    {
      name: "Olaplex No. 3 Plus Complete Repair Treatment",
      url: "https://www.kqzyfj.com/click-101826693-14080031?url=https%3A%2F%2Fwww.ecosmetics.com%2Fproduct%2Fno-3-plus-complete-repair-treatment-3%2F",
    },
  ],
  [
    "joico k-pak color therapy luster lock treatment",
    {
      name: "Joico K-PAK Color Therapy Luster Lock Treatment",
      url: "https://www.kqzyfj.com/click-101826693-14080031?url=https%3A%2F%2Fwww.ecosmetics.com%2Fproduct%2Fk-pak-color-therapy-luster-lock-glossing-oil%2F",
    },
  ],
]);

const legacyAffiliateProducts = new Map([
  ["olaplex no. 3 hair perfector", "olaplex no. 3 plus complete repair treatment"],
  [
    "clairol professional shimmer lights auburn line",
    "joico k-pak color therapy luster lock treatment",
  ],
]);

function replaceLinkContent(node: DefaultTreeAdapterTypes.Element, value: string): void {
  for (const child of node.childNodes) {
    if ("parentNode" in child) child.parentNode = null;
  }
  node.childNodes = [];
  node.childNodes.push({
    nodeName: "#text",
    value,
    parentNode: node,
  });
}

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
        const isLegacyProduct = legacyAffiliateProducts.has(linkText);
        const productName =
          affiliateProducts.get(linkText) ??
          affiliateProducts.get(legacyAffiliateProducts.get(linkText) ?? "");
        const affiliateUrl = isLegacyProduct ? productName?.url : href;

        if (
          productName &&
          affiliateUrl &&
          (isLegacyProduct || isSecureAffiliateUrl(affiliateUrl))
        ) {
          if (isLegacyProduct) {
            replaceLinkContent(node, productName.name);
          }
          node.attrs = [
            { name: "href", value: affiliateUrl },
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
