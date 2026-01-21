import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface PDFExportOptions {
  filename?: string;
  quality?: number;
  scale?: number;
}

export const exportToPDF = async (
  element: HTMLElement,
  options: PDFExportOptions = {}
): Promise<void> => {
  const { 
    filename = 'cv.pdf', 
    quality = 1,
    scale = 2 
  } = options;

  try {
    // Clone the element and append to body temporarily for proper rendering
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.left = '0';
    clone.style.top = '0';
    clone.style.visibility = 'visible';
    clone.style.opacity = '1';
    clone.style.zIndex = '99999';
    clone.style.width = '210mm';
    clone.style.minHeight = '297mm';
    clone.style.backgroundColor = window.getComputedStyle(element).backgroundColor || '#ffffff';
    
    document.body.appendChild(clone);

    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 200));

    // Create canvas from the cloned element
    const canvas = await html2canvas(clone, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      width: clone.offsetWidth,
      height: clone.offsetHeight,
    });

    // Remove the clone
    document.body.removeChild(clone);

    // Calculate dimensions for A4
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgData = canvas.toDataURL('image/png', quality);
    
    // Handle multiple pages if content is longer than one page
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};
