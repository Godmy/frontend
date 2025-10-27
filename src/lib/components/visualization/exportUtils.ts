/**
 * Export an SVG element to PNG
 * @param svgElement - The SVG element to export
 * @param filename - The name of the file to save
 */
export async function exportSvgToPng(svgElement: SVGElement, filename: string = 'visualization.png') {
  // Get the SVG content
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    console.error('Could not get canvas context');
    return;
  }

  // Use Canvg to render SVG to canvas (this is complex, so we'll use a different approach)
  // For now, we'll just download the SVG as is and suggest using an external library like canvg for full rendering
  
  // Create a data URI for the SVG
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);
  
  // Create an image element to draw to canvas
  const img = new Image();
  img.onload = () => {
    canvas.width = svgElement.viewBox.baseVal.width || svgElement.clientWidth;
    canvas.height = svgElement.viewBox.baseVal.height || svgElement.clientHeight;
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Convert to PNG and download
    const pngUrl = canvas.toDataURL('image/png');
    
    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Clean up
    URL.revokeObjectURL(svgUrl);
  };
  
  img.src = svgUrl;
}

/**
 * Export an SVG element directly as SVG file
 * @param svgElement - The SVG element to export
 * @param filename - The name of the file to save
 */
export function exportSvg(svgElement: SVGElement, filename: string = 'visualization.svg') {
  // Get the SVG content
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);
  
  // Create download link
  const downloadLink = document.createElement('a');
  downloadLink.href = svgUrl;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  // Clean up
  URL.revokeObjectURL(svgUrl);
}

/**
 * Export canvas to PNG
 * @param canvas - The canvas element to export
 * @param filename - The name of the file to save
 */
export function exportCanvasToPng(canvas: HTMLCanvasElement, filename: string = 'visualization.png') {
  // Convert to PNG and download
  const pngUrl = canvas.toDataURL('image/png');
  
  // Create download link
  const downloadLink = document.createElement('a');
  downloadLink.href = pngUrl;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}