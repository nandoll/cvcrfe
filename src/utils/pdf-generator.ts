// src/utils/pdf-generator.ts
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { CVData } from "@/types/cv.types";

/**
 * Clase para generar PDF a partir de datos CV
 */
export class PDFGenerator {
  private cvData: CVData;
  private lang: string;
  private doc: jsPDF;

  constructor(cvData: CVData, lang: string = "es") {
    this.cvData = cvData;
    this.lang = lang;
    this.doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
  }

  /**
   * Genera un PDF a partir de un elemento HTML
   */
  async generateFromDOM(element: HTMLElement): Promise<Blob> {
    // Capturar el DOM como canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Mayor resolución
      useCORS: true,
      logging: false,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    this.doc.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Si el contenido ocupa más de una página, agregar nuevas páginas
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      this.doc.addPage();
      this.doc.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Retornar como Blob para descargar
    return this.doc.output("blob");
  }

  /**
   * Genera un PDF programáticamente (alternativa a DOM)
   */
  generateProgrammatically(): Blob {
    // Configurar fuentes y estilos
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(24);
    this.doc.setTextColor(0, 0, 0);

    // Agregar nombre y título
    this.doc.text(this.cvData.name, 20, 20);

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(16);
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(this.cvData.title, 20, 30);

    // Contacto
    this.doc.setFontSize(10);
    this.doc.text(`Email: ${this.cvData.contact.email}`, 20, 40);
    this.doc.text(`Tel: ${this.cvData.contact.phone}`, 20, 45);

    // Resumen
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(12);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(this.lang === "es" ? "Resumen" : "Summary", 20, 55);

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);

    // Dividir el resumen en múltiples líneas
    const summaryLines = this.doc.splitTextToSize(this.cvData.summary, 170);
    this.doc.text(summaryLines, 20, 60);

    // Experiencia
    let yPos = 60 + summaryLines.length * 5;

    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(12);
    this.doc.text(this.lang === "es" ? "Experiencia" : "Experience", 20, yPos);
    yPos += 5;

    // Iterar sobre experiencias
    this.cvData.experiences.forEach((exp) => {
      this.doc.setFont("helvetica", "bold");
      this.doc.setFontSize(11);
      this.doc.text(exp.position, 20, yPos);

      this.doc.setFont("helvetica", "italic");
      this.doc.setFontSize(10);
      this.doc.text(`${exp.company}, ${exp.location}`, 20, yPos + 5);

      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(8);
      this.doc.text(`${exp.startDate} - ${exp.endDate}`, 120, yPos);

      yPos += 10;

      // Responsabilidades
      exp.responsibilities.forEach((resp) => {
        const respLines = this.doc.splitTextToSize(`• ${resp}`, 160);
        this.doc.text(respLines, 25, yPos);
        yPos += respLines.length * 4;
      });

      yPos += 5;
    });

    // Continuar con educación, habilidades, etc.
    // Código similar para las demás secciones...

    // Agregar un footer con fecha
    const today = new Date().toLocaleDateString();
    this.doc.setFontSize(8);
    this.doc.setTextColor(150, 150, 150);
    this.doc.text(`Fernando Antezana CV - ${today}`, 105, 285, {
      align: "center",
    });

    // Incluir QR code para tracking
    // (esto requeriría generar una imagen QR y agregarla al PDF)

    return this.doc.output("blob");
  }

  // Método de conveniencia para descargar directamente
  download(filename: string = "cv.pdf"): void {
    this.doc.save(filename);
  }
}

// Función de utilidad para generar PDF desde un elemento del DOM
export const generatePDFFromElement = async (
  elementId: string,
  cvData: CVData,
  lang: string = "es"
): Promise<Blob> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with ID ${elementId} not found`);
  }

  const generator = new PDFGenerator(cvData, lang);
  return await generator.generateFromDOM(element);
};

// Función para descargar el PDF generado
export const downloadPDF = (blob: Blob, filename: string = "cv.pdf"): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
