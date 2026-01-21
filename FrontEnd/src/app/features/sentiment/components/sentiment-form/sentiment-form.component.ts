import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { SentimentService } from '../../../../core/services/sentiment.service';
import { lastValueFrom } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { BatchResultsComponent } from '../batch-results/batch-results.component';

@Component({
  selector: 'app-sentiment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, BatchResultsComponent],
  templateUrl: './sentiment-form.component.html',
  styleUrl: './sentiment-form.component.css',
})
export class SentimentFormComponent {
  // Estado del formulario de texto
  text = '';
  loading = false;

  // Configuración de modelos
  models = [
    { id: 'tfidf', name: 'TF-IDF (Modelo Actual)', available: true },
    { id: 'bert', name: 'BERT Transformer', available: false },
    { id: 'roberta', name: 'RoBERTa Large', available: false },
  ];
  selectedModel = this.models[0].id;

  // Inputs de estado de API (vienen del padre)
  @Input() apiOnline = false;
  @Input() checkingApi = false;

  // Output para comunicar el análisis al padre
  @Output() analyzeText = new EventEmitter<string>();
  @Output() batchComplete = new EventEmitter<void>();

  // Estado de navegación y archivos
  activeTab: 'text' | 'file' = 'text';
  selectedFile: File | null = null;
  processingBatch = false;
  uploadProgress = 0;
  isDragging = false;

  // Estado de parsing de archivos
  fileColumns: string[] = [];
  selectedColumn = '';
  parsedData: any[] = [];
  batchResults: any[] = [];

  constructor(
    private sentimentService: SentimentService,
    private toastService: ToastService
  ) {}

  // --- MÉTODOS DE ACCIÓN (Llamados desde el HTML) ---

  /**
   * Corrige el error NG9: "Property 'submit' does not exist"
   */
  submit() {
    this.analyze();
  }

  /**
   * Lógica para el botón "ANALIZAR" del Tab de texto
   */
  analyze() {
    if (!this.text.trim() || !this.apiOnline || this.checkingApi) return;

    this.loading = true;
    this.analyzeText.emit(this.text);
  }

  onModelChange(modelId: string) {
    const model = this.models.find((m) => m.id === modelId);
    if (model && !model.available) {
      this.toastService.showError('Este modelo aún no está disponible');
      return;
    }
    this.selectedModel = modelId;
  }

  clear() {
    this.text = '';
  }

  stopLoading() {
    this.loading = false;
  }

  // --- LÓGICA DE ARCHIVOS (Batch Processing) ---

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files.length) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: any) {
    if (event.target.files.length) {
      this.processFile(event.target.files[0]);
    }
  }

  async processFile(file: File) {
    this.selectedFile = file;
    this.fileColumns = [];
    this.selectedColumn = '';
    this.parsedData = [];

    const ext = file.name.split('.').pop()?.toLowerCase();

    try {
      if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
        await this.parseExcel(file);
      } else if (ext === 'json') {
        await this.parseJson(file);
      } else if (ext === 'txt') {
        await this.parseTxt(file);
      } else {
        this.toastService.showError('Formato de archivo no soportado');
        this.selectedFile = null;
      }
    } catch (error) {
      this.toastService.showError('Error al procesar el archivo');
      this.selectedFile = null;
    }
  }

  private async parseExcel(file: File) {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows: any[][] = XLSX.utils.sheet_to_json(firstSheet, {
      header: 1,
    });

    if (rawRows.length > 0) {
      this.fileColumns = rawRows[0].map((col) => String(col));
      this.parsedData = XLSX.utils.sheet_to_json(firstSheet);

      const commonNames = [
        'comentario',
        'text',
        'texto',
        'comment',
        'review',
        'mensaje',
      ];
      this.selectedColumn =
        this.fileColumns.find((c) => commonNames.includes(c.toLowerCase())) ||
        this.fileColumns[0];
    }
  }

  private async parseJson(file: File) {
    const content = await file.text();
    const json = JSON.parse(content);
    if (Array.isArray(json)) {
      this.parsedData = json;
      if (json.length > 0) {
        if (typeof json[0] === 'object') {
          this.fileColumns = Object.keys(json[0]);
          this.selectedColumn = this.fileColumns[0];
        } else {
          this.parsedData = json.map((t) => ({ text: t }));
          this.selectedColumn = 'text';
        }
      }
    }
  }

  private async parseTxt(file: File) {
    const content = await file.text();
    const lines = content.split('\n').filter((l) => l.trim().length > 0);
    this.parsedData = lines.map((l) => ({ text: l.trim() }));
    this.selectedColumn = 'text';
  }

  async processBatch() {
    if (!this.parsedData.length || !this.apiOnline) return;

    this.processingBatch = true;
    this.uploadProgress = 0;
    this.batchResults = [];

    const field = this.fileColumns.length ? this.selectedColumn : 'text';
    const total = this.parsedData.length;

    for (let i = 0; i < total; i++) {
      const textToAnalyze = this.parsedData[i][field];

      if (textToAnalyze && String(textToAnalyze).trim()) {
        try {
          const res = await lastValueFrom(
            this.sentimentService.analyze(String(textToAnalyze))
          );
          this.batchResults.push({
            text: textToAnalyze,
            analysis: res,
            original: this.parsedData[i],
          });
        } catch (err) {
          this.batchResults.push({
            text: textToAnalyze,
            error: true,
            original: this.parsedData[i],
          });
        }
      }
      this.uploadProgress = Math.round(((i + 1) / total) * 100);
    }
    this.processingBatch = false;
    this.batchComplete.emit();
    this.toastService.showSuccess('Análisis masivo completado');
  }
}
