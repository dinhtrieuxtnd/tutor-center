'use client';

import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
}

interface PDFDocumentProps {
  url: string;
  pageNumber: number;
  scale: number;
  onLoadSuccess: (pdf: any) => void;
  onLoadError: (error: Error) => void;
}

export function PDFDocument({
  url,
  pageNumber,
  scale,
  onLoadSuccess,
  onLoadError,
}: PDFDocumentProps) {
  return (
    <Document
      file={url}
      onLoadSuccess={onLoadSuccess}
      onLoadError={onLoadError}
      loading=""
      className="pdf-document"
    >
      <Page
        pageNumber={pageNumber}
        scale={scale}
        renderTextLayer={true}
        renderAnnotationLayer={true}
        className="shadow-lg"
      />
    </Document>
  );
}
