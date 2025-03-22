"use client";

// src/utils/pdf-generator.ts
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { CVData } from "@/types/cv.types";

/**
 * Clase optimizada para generar PDF a partir de datos CV
 */
export class PDFGenerator {
  private cvData: CVData;
  private lang: string;
  private doc: jsPDF;
  private readonly pageWidth = 210; // A4 width en mm
  private readonly pageHeight = 297; // A4 height en mm

  constructor(cvData: CVData, lang: string = "es") {
    this.cvData = cvData;
    this.lang = lang;
    this.doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true, // Compresión de PDF para reducir tamaño
    });

    // Configurar fuentes por defecto
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
  }

  /**
   * Genera un PDF a partir de un elemento HTML con opciones de calidad mejoradas
   */
  async generateFromDOM(element: HTMLElement): Promise<Blob> {
    try {
      // Configurar opciones de html2canvas para mejor calidad
      const options = {
        scale: 2, // Mayor resolución
        useCORS: true, // Permitir recursos externos
        logging: false, // Desactivar logs en producción
        allowTaint: true, // Permitir contenido que podría "contaminar" el canvas
        backgroundColor: "#FFFFFF", // Fondo blanco por defecto
        letterRendering: true, // Mejor renderizado de texto
      };

      // Capturar el DOM como canvas
      const canvas = await html2canvas(element, options);

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const imgWidth = this.pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Primera página
      this.doc.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= this.pageHeight;

      // Si el contenido ocupa más de una página, agregar nuevas páginas
      let pageNum = 1;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        this.doc.addPage();
        this.doc.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= this.pageHeight;
        pageNum++;
      }

      // Agregar metadatos al PDF
      this.addMetadata();

      // Retornar como Blob para descargar
      return this.doc.output("blob");
    } catch (error) {
      console.error("Error generating PDF from DOM:", error);
      throw error;
    }
  }

  /**
   * Genera un PDF programáticamente con diseño mejorado
   */
  generateProgrammatically(): Blob {
    try {
      // Agregar metadata
      this.addMetadata();

      // Márgenes
      const margin = 20; // mm
      const contentWidth = this.pageWidth - 2 * margin;
      let yPos = margin;

      // Título y encabezado
      this.doc.setFont("helvetica", "bold");
      this.doc.setFontSize(24);
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(this.cvData.name, margin, yPos);
      yPos += 10;

      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(16);
      this.doc.setTextColor(100, 100, 100);
      this.doc.text(this.cvData.title, margin, yPos);
      yPos += 10;

      // Contacto
      this.doc.setFontSize(10);
      this.doc.text(`Email: ${this.cvData.contact.email}`, margin, yPos);
      yPos += 5;
      this.doc.text(`Tel: ${this.cvData.contact.phone}`, margin, yPos);
      yPos += 10;

      // Línea divisoria
      this.drawLine(margin, yPos, this.pageWidth - margin, yPos);
      yPos += 5;

      // Resumen
      this.doc.setFont("helvetica", "bold");
      this.doc.setFontSize(12);
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(this.lang === "es" ? "Resumen" : "Summary", margin, yPos);
      yPos += 6;

      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(10);

      // Dividir el resumen en múltiples líneas
      const summaryLines = this.doc.splitTextToSize(
        this.cvData.summary,
        contentWidth
      );
      this.doc.text(summaryLines, margin, yPos);
      yPos += summaryLines.length * 4 + 6;

      // Experiencia
      this.doc.setFont("helvetica", "bold");
      this.doc.setFontSize(12);
      this.doc.text(
        this.lang === "es" ? "Experiencia" : "Experience",
        margin,
        yPos
      );
      yPos += 6;

      // Iterar sobre experiencias
      this.cvData.experiences.forEach((exp) => {
        if (yPos > this.pageHeight - margin * 2) {
          this.doc.addPage();
          yPos = margin;
        }

        this.doc.setFont("helvetica", "bold");
        this.doc.setFontSize(11);
        this.doc.text(exp.position, margin, yPos);

        // Fecha a la derecha
        this.doc.setFont("helvetica", "normal");
        this.doc.setFontSize(10);
        const dateText = `${exp.startDate} - ${exp.endDate}`;
        const dateWidth = this.doc.getTextWidth(dateText);
        this.doc.text(dateText, this.pageWidth - margin - dateWidth, yPos);

        yPos += 5;

        this.doc.setFont("helvetica", "italic");
        this.doc.setFontSize(10);
        this.doc.text(
          `${exp.company}, ${exp.location}${
            exp.remote ? (this.lang === "es" ? " (Remoto)" : " (Remote)") : ""
          }`,
          margin,
          yPos
        );
        yPos += 6;

        // Responsabilidades
        this.doc.setFont("helvetica", "normal");
        this.doc.setFontSize(9);

        exp.responsibilities.forEach((resp) => {
          if (yPos > this.pageHeight - margin * 2) {
            this.doc.addPage();
            yPos = margin;
          }

          const respLines = this.doc.splitTextToSize(
            `• ${resp}`,
            contentWidth - 5
          );
          this.doc.text(respLines, margin + 5, yPos);
          yPos += respLines.length * 4 + 2;
        });

        // Tecnologías utilizadas
        if (exp.technologies && exp.technologies.length > 0) {
          if (yPos > this.pageHeight - margin * 2) {
            this.doc.addPage();
            yPos = margin;
          }

          this.doc.setFont("helvetica", "italic");
          this.doc.setFontSize(9);
          const techText = `${
            this.lang === "es" ? "Tecnologías" : "Technologies"
          }: ${exp.technologies.join(", ")}`;
          const techLines = this.doc.splitTextToSize(
            techText,
            contentWidth - 5
          );
          this.doc.text(techLines, margin + 5, yPos);
          yPos += techLines.length * 4 + 6;
        } else {
          yPos += 6;
        }
      });

      // Agregar un footer con fecha
      this.addFooter();

      return this.doc.output("blob");
    } catch (error) {
      console.error("Error generating PDF programmatically:", error);
      throw error;
    }
  }

  /**
   * Agrega metadatos al PDF
   */
  private addMetadata(): void {
    this.doc.setProperties({
      title: `${this.cvData.name} - CV`,
      subject: this.cvData.title,
      author: this.cvData.name,
      keywords: "CV, Resume, Frontend Developer",
      creator: "CV Creator App",
      producer: "CV Creator App",
    });
  }

  /**
   * Agregar un footer al PDF
   */
  private addFooter(): void {
    const pageCount = this.doc.getNumberOfPages();
    const footerText = `${
      this.cvData.name
    } - CV • ${new Date().toLocaleDateString()} • `;

    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(8);
      this.doc.setTextColor(150, 150, 150);

      const text = `${footerText} ${i} / ${pageCount}`;
      const textWidth = this.doc.getTextWidth(text);

      this.doc.text(
        text,
        this.pageWidth / 2 - textWidth / 2,
        this.pageHeight - 10
      );
    }
  }

  /**
   * Dibujar una línea horizontal
   */
  private drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string = "#CCCCCC"
  ): void {
    const drawColor = this.doc.getDrawColor();
    this.doc.setDrawColor(color);
    this.doc.line(x1, y1, x2, y2);
    this.doc.setDrawColor(drawColor);
  }

  /**
   * Método de conveniencia para descargar directamente
   */
  download(filename: string = "cv.pdf"): void {
    this.doc.save(filename);
  }
}

/**
 * Función de utilidad para generar PDF desde un elemento del DOM
 */
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

/**
 * Función para descargar el PDF generado
 */
export const downloadPDF = (blob: Blob, filename: string = "cv.pdf"): void => {
  // Crear un URL temporal
  const url = URL.createObjectURL(blob);

  // Crear un link para descargar
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  // Añadir a DOM, clicar y eliminar
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Liberar el URL creado
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

/**
 * Función para previsualizar el PDF generado
 */
export const previewPDF = (blob: Blob): void => {
  // Crear un URL temporal
  const url = URL.createObjectURL(blob);

  // Abrir en una nueva ventana o pestaña
  window.open(url, "_blank");

  // Liberar el URL creado después de un tiempo
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
