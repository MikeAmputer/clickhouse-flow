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

  const originalTransform = getComputedStyle(container).transform;
  clone.style.transform = originalTransform;
  iframeDocument.body.append(clone);
  inlineEdgeStyles(clone);

  const svgDocument = elementToSVG(iframeDocument.documentElement);
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