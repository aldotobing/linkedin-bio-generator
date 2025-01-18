import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import jsPDF from "jspdf";

export function usePDFGeneration() {
  const formatContent = (content: string) => {
    const lines = content.split("\n");
    const formattedLines = lines
      .map((line) => line.trim())
      .filter((line) => line !== "");
    return formattedLines;
  };

  const generatePDF = (content: string) => {
    const doc = new jsPDF();
    const formattedContent = formatContent(content);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    let yPosition = 20;
    formattedContent.forEach((line, index) => {
      if (index === 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
      }

      doc.text(line, 20, yPosition);
      yPosition += 7;

      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
    });

    doc.save("Cover_Letter.pdf");
  };

  const generateDOCX = (content: string) => {
    const formattedContent = formatContent(content);

    const doc = new Document({
      sections: [
        {
          children: formattedContent.map(
            (line, index) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    bold: index === 0, // Make the first line bold
                  }),
                ],
                alignment: AlignmentType.LEFT,
              })
          ),
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "Cover_Letter.docx");
    });
  };

  return { generatePDF, generateDOCX };
}
