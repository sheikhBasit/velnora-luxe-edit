import { parseFragment, serialize, type DefaultTreeAdapterTypes } from "parse5";

type AffiliateProduct = {
  name: string;
  url: string;
};

const affiliateProducts = new Map<string, AffiliateProduct>([
  [
    "clinique beyond perfecting foundation + concealer",
    {
      name: "Clinique Beyond Perfecting Foundation + Concealer",
      url: "https://www.ecosmetics.com/product/clinique-beyond-perfecting-foundation-concealer/?ref=velnora&utm_source=affiliate",
    },
  ],
  [
    "sigma beauty cream blush in pashmina",
    {
      name: "Sigma Beauty Cream Blush in Pashmina",
      url: "https://www.ecosmetics.com/product/sigma-beauty-cream-blush-pashmina/?ref=velnora&utm_source=affiliate",
    },
  ],
  [
    "covergirl trunaked eyeshadow palette in roses",
    {
      name: "CoverGirl TruNaked Eyeshadow Palette in Roses",
      url: "https://www.ecosmetics.com/product/covergirl-trunaked-eyeshadow-palette-roses/?ref=velnora&utm_source=affiliate",
    },
  ],
  [
    "dose of colors matte liquid lipstick in berry me",
    {
      name: "Dose of Colors Matte Liquid Lipstick in Berry Me",
      url: "https://www.ecosmetics.com/product/dose-of-colors-matte-liquid-lipstick-berry-me/?ref=velnora&utm_source=affiliate",
    },
  ],
  [
    "mac macximal silky matte lipstick in diva",
    {
      name: "MAC Macximal Silky Matte Lipstick in Diva",
      url: "https://www.ecosmetics.com/product/mac-macximal-silky-matte-lipstick-diva/?ref=velnora&utm_source=affiliate",
    },
  ],
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function linkBareAffiliateProductMentions(parent: DefaultTreeAdapterTypes.ParentNode): void {
  let index = 0;

  while (index < parent.childNodes.length) {
    const node = parent.childNodes[index];

    if (node.nodeName === "#text") {
      const text = node.value;
      const lowerText = text.toLowerCase();
      let cursor = 0;
      let linkedHtml = "";
      let foundMention = false;

      while (cursor < text.length) {
        let nextMention: { index: number; product: AffiliateProduct } | undefined;

        for (const [mention, product] of affiliateProducts) {
          const mentionIndex = lowerText.indexOf(mention, cursor);
          if (mentionIndex >= 0 && (!nextMention || mentionIndex < nextMention.index)) {
            nextMention = { index: mentionIndex, product };
          }
        }

        if (!nextMention) break;

        const originalMention = text.slice(
          nextMention.index,
          nextMention.index + nextMention.product.name.length,
        );
        linkedHtml +=
          `${escapeHtml(text.slice(cursor, nextMention.index))}` +
          `<a href="${escapeHtml(nextMention.product.url)}" class="affiliate-product-link" rel="sponsored nofollow noopener noreferrer" target="_blank">${escapeHtml(originalMention)}</a>`;
        cursor = nextMention.index + nextMention.product.name.length;
        foundMention = true;
      }

      if (foundMention) {
        linkedHtml += escapeHtml(text.slice(cursor));
        const replacements = parseFragment(linkedHtml).childNodes;
        parent.childNodes.splice(index, 1, ...replacements);
        for (const replacement of replacements) {
          if ("parentNode" in replacement) replacement.parentNode = parent;
        }
        index += replacements.length;
        continue;
      }
    } else if ("tagName" in node && node.tagName !== "a" && "childNodes" in node) {
      linkBareAffiliateProductMentions(node);
    }

    index += 1;
  }
}

export function linkBlogAffiliateProducts(html: string): string {
  const fragment = parseFragment(html.replace(/(?:&nbsp;|&#160;|\u00a0)/gi, " "));
  linkBareAffiliateProductMentions(fragment);
  return serialize(fragment);
}

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
  linkBareAffiliateProductMentions(fragment);

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
