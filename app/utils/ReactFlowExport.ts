import { elementToSVG } from "dom-to-svg";
import jsPDF from "jspdf";
import { svg2pdf } from "svg2pdf.js";

function fetchCSS(): string {
  let css = "";
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const rules = sheet.cssRules;
      for (const rule of Array.from(rules)) {
        css += rule.cssText + "\n";
      }
    } catch (e) { }
  }

  return css;
}

function inlineEdgeStyles(container: HTMLElement) {
  const edgePaths = container.querySelectorAll<SVGPathElement>(".react-flow__edge-path");

  edgePaths.forEach((path) => {
    path.setAttribute("stroke", "#000");
    path.setAttribute("stroke-width", "1");
    path.setAttribute("fill", "none");

    const markerId = "arrow-closed";
    path.setAttribute("marker-end", `url(#${markerId})`);

    const currentTransform = path.getAttribute("transform") || "";
    path.setAttribute("transform", `${currentTransform} translate(-10, 0)`.trim());

    const svg = path.closest("svg");
    if (svg && !svg.querySelector(`#${markerId}`)) {
      const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
      marker.setAttribute("id", markerId);
      marker.setAttribute("viewBox", "0 0 10 10");
      marker.setAttribute("refY", "5");
      marker.setAttribute("markerWidth", "10");
      marker.setAttribute("markerHeight", "10");
      marker.setAttribute("orient", "auto");
      marker.setAttribute("markerUnits", "userSpaceOnUse");

      const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
      arrow.setAttribute("d", "M0,0 L10,5 L0,10 Z");
      arrow.setAttribute("fill", "#000");

      marker.appendChild(arrow);
      const defs = svg.querySelector("defs")
        || svg.insertBefore(document.createElementNS("http://www.w3.org/2000/svg", "defs"), svg.firstChild);
      defs.appendChild(marker);
    }
  });
}

export const exportReactFlow = async (width: number, height: number, dbConfigName: string, format: 'PDF' | 'SVG') => {
  const containerQuery = ".react-flow";

  const container = document.querySelector(containerQuery);
  if (!container) throw new Error(`Could not find container with query: ${containerQuery}`);

  const iframe = document.createElement("iframe");
  iframe.style.width = `${width}px`;
  iframe.style.height = `${height}px`;
  iframe.style.position = "absolute";
  iframe.style.top = "150%";
  iframe.style.left = "150%";
  document.body.append(iframe);

  const iframeDocument = iframe.contentDocument;
  if (!iframeDocument) throw new Error("Could not get iframe document");

  await ensureFontLoaded();
  injectFontFaceIntoIframe(iframeDocument);
  await iframeDocument.fonts.ready;
  await ensureFontLoaded();

  const iframeStyle = iframeDocument.createElement("style");
  iframeStyle.innerHTML = fetchCSS();
  iframeDocument.head.append(iframeStyle);

  const clone = container.cloneNode(true) as HTMLElement;

  const elementsToHide = clone.querySelectorAll('[export-hide="true"]');
  elementsToHide.forEach(el => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.opacity = '0';
    htmlEl.style.pointerEvents = 'none';
  });

  const cellsToTrim = clone.querySelectorAll('[export-trim="true"]');
  cellsToTrim.forEach((cell) => {
    const el = cell as HTMLElement;
    el.style.borderRightWidth = '0px';
    el.style.borderLeftWidth = '0px';
    el.style.borderBottomWidth = '0px';
    el.style.borderTopWidth = '0px';
  });

  const sqlTextCells = clone.querySelectorAll('[sql-text="true"]');
  sqlTextCells.forEach((cell) => {
    const el = cell as HTMLElement;

    el.style.fontFamily = "JetBrainsMonoRegular";
    el.style.fontSize = "12.8px";

    const text = el.textContent || "";

    const html = text
      .split("\n")
      .map((line) => {
        const leading = line.match(/^\s+/)?.[0] ?? "";
        const rest = line.slice(leading.length);

        const escapedRest = rest
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        const escapedLeading = leading
          .replace(/\t/g, "  ")
          .replace(/ /g, "&nbsp;");

        return escapedLeading + escapedRest;
      })
      .join("<br/>");

    el.innerHTML = html;
  });

  const originalTransform = getComputedStyle(container).transform;
  clone.style.transform = originalTransform;
  iframeDocument.body.append(clone);
  inlineEdgeStyles(clone);

  const svgDocument = elementToSVG(iframeDocument.documentElement);

  const svgRoot = svgDocument.documentElement as unknown as SVGElement;

  const fontBase64 = await loadFont("/fonts/JetBrainsMono-Regular.ttf");
  injectFontIntoSvg(svgRoot, fontBase64, 'JetBrainsMonoRegular');

  const svgString = new XMLSerializer().serializeToString(svgDocument);

  if (format === 'SVG') {
    const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(svgBlob);

    const a = document.createElement("a");
    a.href = svgUrl;
    a.download = `chflow_${dbConfigName}.svg`;
    a.click();
    URL.revokeObjectURL(svgUrl);
  }
  else if (format === 'PDF') {
    const pdf = new jsPDF({
      orientation: width > height ? "landscape" : "portrait",
      unit: "pt",
      format: [width, height],
    });

    const font = await loadFont("/fonts/JetBrainsMono-Regular.ttf");

    pdf.addFileToVFS("JetBrainsMono-Regular.ttf", font);
    pdf.addFont("JetBrainsMono-Regular.ttf", "JetBrainsMonoRegular", "normal");
    pdf.setFont("JetBrainsMonoRegular");

    const parser = new DOMParser();
    const svgElement = parser.parseFromString(svgString, "image/svg+xml").documentElement;

    await svg2pdf(svgElement, pdf, {
      x: 0,
      y: 0,
      width,
      height,
    });

    pdf.save(`chflow_${dbConfigName}.pdf`);
  }

  setTimeout(() => iframe.remove(), 1000);
};

function injectFontIntoSvg(svg: SVGElement, base64Font: string, fontFamily: string) {
  const style = document.createElementNS("http://www.w3.org/2000/svg", "style");

  style.textContent = `
@font-face {
  font-family: "${fontFamily}";
  src: url("data:font/truetype;base64,${base64Font}") format("truetype");
  font-weight: normal;
  font-style: normal;
}
`;

  svg.insertBefore(style, svg.firstChild);
}

async function loadFont(url: string): Promise<string> {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();

  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return btoa(binary);
}

async function ensureFontLoaded() {
  const font = new FontFace(
    "JetBrainsMonoRegular",
    "url(/fonts/JetBrainsMono-Regular.ttf)"
  );

  await font.load();
  document.fonts.add(font);
  await document.fonts.ready;
}

function injectFontFaceIntoIframe(doc: Document) {
  const style = doc.createElement("style");
  style.textContent = `
    @font-face {
      font-family: "JetBrainsMonoRegular";
      src: url("/fonts/JetBrainsMono-Regular.ttf") format("truetype");
      font-weight: normal;
      font-style: normal;
    }
  `;
  doc.head.appendChild(style);
}