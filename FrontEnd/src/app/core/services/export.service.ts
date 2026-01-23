import { Injectable } from '@angular/core';
import { SentimentMetrics } from '../models/sentiment-metrics';
import { SentimentHistoryItem } from '../models/sentiment-response';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor() {}

  exportBatchResults(results: any[]) {
    // Map results to flat structure including original columns + analysis
    const data = results.map((item) => {
      const original = item.original || {};
      return {
        ...original,
        Sentimiento_Predicho: item.analysis?.sentiment,
        Probabilidad: item.analysis?.probability
          ? (item.analysis.probability * 100).toFixed(2) + '%'
          : 'N/A',
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Resultados IA');
    XLSX.writeFile(wb, 'reporte-analisis-masivo.xlsx');
  }

  exportToTxt(metrics: SentimentMetrics) {
    const text = `ANÁLISIS DE SENTIMIENTO\n\nPositivos: ${metrics.positivos}\nNeutros: ${metrics.neutros}\nNegativos: ${metrics.negativos}\nPrecisión Promedio: ${metrics.pctPositivos}%`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sentimiento-reporte.txt';
    a.click();
  }

  exportToExcel(metrics: SentimentMetrics, history: SentimentHistoryItem[]) {
    // Hoja 1: Métricas
    const metricsData = [
      {
        Categoria: 'Positivo',
        Cantidad: metrics.positivos,
        Porcentaje: metrics.pctPositivos + '%',
      },
      {
        Categoria: 'Neutro',
        Cantidad: metrics.neutros,
        Porcentaje: metrics.pctNeutros + '%',
      },
      {
        Categoria: 'Negativo',
        Cantidad: metrics.negativos,
        Porcentaje: metrics.pctNegativos + '%',
      },
    ];
    const wsMetrics = XLSX.utils.json_to_sheet(metricsData);

    // Hoja 2: Historial
    const historyData = history.map((item) => ({
      ID: item.id,
      Comentario: item.text,
      Sentimiento: item.sentiment,
      Probabilidad: (item.probability * 100).toFixed(2) + '%',
    }));
    const wsHistory = XLSX.utils.json_to_sheet(historyData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsMetrics, 'Métricas');
    XLSX.utils.book_append_sheet(wb, wsHistory, 'Detalle Comentarios');

    XLSX.writeFile(wb, 'sentimiento-reporte-completo.xlsx');
  }

  async exportToPdf(element: HTMLElement) {
    // 1. GUARDAR ESTILOS ORIGINALES
    const originalStyle = element.getAttribute('style');
    const originalWidth = element.style.width;
    const wasDark = element.classList.contains('dark');

    // Buscar el grid interno para forzar 2 columnas
    const grid = element.querySelector('.grid') as HTMLElement;
    const originalGridTemplate = grid ? grid.style.gridTemplateColumns : '';

    try {
      // 2. FORZAR FORMATO DE ALTA CALIDAD (Independiente del dispositivo)
      // Forzamos un ancho de escritorio (ej. 1366px) para que el grid se vea bien en el PDF
      element.style.width = '1366px'; // Laptop view width
      element.style.maxWidth = 'none';

      // Forzar modo oscuro para asegurar que el texto sea blanco
      if (!wasDark) {
        element.classList.add('dark');
      }

      // Forzar layout de 2 columnas (Desktop) ignorando media queries
      if (grid) {
        grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
      }

      // ESPERAR A QUE LOS GRÁFICOS SE REDIBUJEN
      await new Promise((resolve) => setTimeout(resolve, 800));

      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2, // Calidad Retina
        backgroundColor: '#0f172a', // Fondo oscuro (Slate 950)
        width: 1366,
        // Esto asegura que se capture todo el alto aunque haya scroll
        height: element.scrollHeight,
        style: {
          borderRadius: '0',
          padding: '20px', // Margen interno para el PDF
          margin: '0',
          color: '#ffffff', // Forzar color de texto base a blanco
        },
      });

      // 3. CONFIGURAR PDF SEGÚN ORIENTACIÓN
      // Si el contenido es más ancho que alto, usamos 'l' (landscape), si no 'p' (portrait)
      const pdf = new jsPDF({
        orientation: element.scrollHeight > 1200 ? 'p' : 'l',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.scrollHeight * pdfWidth) / 1366; // Maintain aspect ratio for 1366px width

      pdf.addImage(
        dataUrl,
        'PNG',
        0,
        0,
        pdfWidth,
        pdfHeight,
        undefined,
        'FAST'
      );
      pdf.save('intelligence-report-completo.pdf');
    } catch (error) {
      console.error('Error generando PDF:', error);
    } finally {
      // 4. RESTAURAR ESTILOS ORIGINALES (El usuario no notará el cambio)
      if (originalStyle) {
        element.setAttribute('style', originalStyle);
      } else {
        element.style.width = originalWidth;
      }

      if (grid) {
        grid.style.gridTemplateColumns = originalGridTemplate;
      }

      if (!wasDark) {
        element.classList.remove('dark');
      }
    }
  }
}
