import {
  Component,
  Input,
  OnChanges,
  ViewChild,
  ElementRef,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApexStroke, NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexTooltip,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexYAxis,
} from 'ng-apexcharts';
import { SentimentMetrics } from '../../../core/models/sentiment-metrics';

import { ExportService } from '../../../core/services/export.service';

import { SentimentHistoryItem } from '../../../core/models/sentiment-response';

@Component({
  selector: 'app-sentiment-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './sentiment-chart.component.html',
})
// ... class definition ...
export class SentimentChartComponent implements OnChanges {
  constructor(private exportService: ExportService) {}

  @Input() metrics!: SentimentMetrics;
  @Input() history: SentimentHistoryItem[] = []; // Input para el historial
  @ViewChild('dashboardContent') dashboardContent!: ElementRef;

  isExpanded: boolean = true;
  donutSeries: ApexNonAxisChartSeries = [];
  barSeries: ApexAxisChartSeries = [];
  lineSeries: ApexAxisChartSeries = [];
  radialSeries: ApexNonAxisChartSeries = [];

  donutChart!: ApexChart;
  barChart!: ApexChart;
  lineChart!: ApexChart;
  radialChart!: ApexChart;

  radialPlotOptions!: ApexPlotOptions;
  radialStroke!: ApexStroke;

  // New properties for Time-Based Analysis
  viewMode: 'WEEK' | 'MONTH' = 'WEEK';
  currentDate: Date = new Date();
  enrichedHistory: (Omit<SentimentHistoryItem, 'date'> & { date: Date })[] = [];
  showTrendModal: boolean = false;

  // Format for date range display
  dateRangeLabel: string = '';

  labels = ['Positivo', 'Neutro', 'Negativo'];
  colors = ['#10b981', '#94a3b8', '#f43f5e'];

  // Basic styling for better visibility
  commonChartOptions = {
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff'],
        fontSize: '11px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
      },
      background: {
        enabled: true,
        foreColor: '#000',
        padding: 4,
        borderRadius: 2,
        borderWidth: 0,
        opacity: 0.9,
      },
    },
    stroke: {
      curve: 'smooth' as const,
      width: 2, // THIN LINES
      lineCap: 'round' as const,
    },
  };

  legendConfig = {
    show: true,
    position: 'bottom' as const,
    fontFamily: 'Inter, sans-serif',
    fontSize: '13px',
    labels: {
      colors: '#ffffff',
      useSeriesColors: false,
    },
    markers: { width: 12, height: 12, radius: 12 },
  };

  public strokeOptions: ApexStroke = {
    curve: 'smooth',
    width: 2,
    lineCap: 'round',
  };

  tooltipConfig: ApexTooltip = {
    theme: 'dark',
    followCursor: true,
    custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
      const isSingleSeries = !Array.isArray(series[0]);
      const label =
        w.globals.labels[dataPointIndex] ||
        w.globals.seriesNames[seriesIndex] ||
        'Dato';
      let rowsHtml = '';

      if (isSingleSeries) {
        const value = series[seriesIndex];
        const color = w.globals.colors[dataPointIndex];
        rowsHtml = `
          <div class="flex items-center gap-4">
            <span class="w-3 h-3 rounded-full" style="background-color: ${color}"></span>
            <span class="text-slate-300 text-xs font-semibold">${label}:</span>
            <span class="text-white text-xs font-black ml-auto">${value}</span>
          </div>`;
      } else {
        rowsHtml = series
          .map(
            (val: any, i: number) => `
          <div class="flex items-center gap-4">
            <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${w.globals.colors[i]}"></span>
            <span class="text-slate-300 text-xs font-medium">${w.globals.seriesNames[i]}:</span>
            <span class="text-white text-xs font-bold ml-auto">${val[dataPointIndex]}</span>
          </div>
        `
          )
          .join('');
      }

      return `
        <div class="bg-slate-950 border border-white/10 p-3 shadow-2xl rounded-xl backdrop-blur-md" style="border: none !important;">
          <div class="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 border-b border-white/5 pb-1">
            ${label}
          </div>
          <div class="flex flex-col gap-2">
            ${rowsHtml}
          </div>
        </div>
      `;
    },
  };

  toggleDashboard() {
    this.isExpanded = true;
  }

  exportToTxt() {
    this.exportService.exportToTxt(this.metrics);
  }

  exportToExcel() {
    this.exportService.exportToExcel(this.metrics, this.history);
  }

  async exportToPdf() {
    await this.exportService.exportToPdf(this.dashboardContent.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['history'] && this.history) {
      this.parseHistoryDates();
      this.updateTrendChart();
    }

    // Always update charts if metrics or history changed
    if (this.metrics) {
      this.updateStaticCharts();
      this.updateTrendChart(); // This handles the dynamic data
    }
  }

  parseHistoryDates() {
    // Use REAL dates from API
    this.enrichedHistory = this.history.map((item) => {
      let date = new Date(); // Default to now
      if (item.date) {
        const d = new Date(item.date);
        if (!isNaN(d.getTime())) {
          date = d;
        }
      }
      return { ...item, date };
    });
  }

  toggleTrendModal() {
    this.showTrendModal = !this.showTrendModal;
  }

  trendYAxis: ApexYAxis = {
    labels: { style: { colors: '#ffffff' } },
  };

  updateStaticCharts() {
    // Updates Donut, Bar, Radial (unchanged logic mostly)
    const values = [
      this.metrics.positivos,
      this.metrics.neutros,
      this.metrics.negativos,
    ];

    this.donutChart = {
      type: 'donut',
      height: 250,
      animations: { enabled: true },
    };
    this.donutSeries = values;

    this.barChart = {
      type: 'bar',
      height: 250,
      toolbar: { show: false },
    };
    this.barSeries = [{ name: 'Registros', data: values }];

    this.radialChart = {
      type: 'radialBar',
      height: 280,
      fontFamily: 'Inter, sans-serif',
    };
    this.radialSeries = [
      Math.round(this.metrics.pctPositivos),
      Math.round(this.metrics.pctNeutros),
      Math.round(this.metrics.pctNegativos),
    ];
    this.radialPlotOptions = {
      radialBar: {
        hollow: {
          size: '50%',
          background: 'transparent',
        },
        track: {
          background: '#1e293b',
          strokeWidth: '100%',
        },
        dataLabels: {
          name: {
            fontSize: '14px',
            color: '#94a3b8',
            offsetY: -3,
            show: true,
          },
          value: {
            fontSize: '16px',
            color: '#ffffff',
            fontWeight: 700,
            offsetY: 3,
            show: true,
            formatter: (val) => val + '%',
          },
          total: {
            show: true,
            label: 'Promedio',
            color: '#94a3b8',
            fontSize: '12px',
            formatter: () => '100%',
          },
        },
      },
    };
    this.radialStroke = { lineCap: 'round' };
  }

  // --- TREND CHART LOGIC ---

  setViewMode(mode: 'WEEK' | 'MONTH') {
    this.viewMode = mode;
    this.currentDate = new Date(); // Reset to now
    this.updateTrendChart();
  }

  prevPeriod() {
    const newDate = new Date(this.currentDate);
    if (this.viewMode === 'WEEK') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    this.currentDate = newDate;
    this.updateTrendChart();
  }

  nextPeriod() {
    const newDate = new Date(this.currentDate);
    if (this.viewMode === 'WEEK') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    // Optional: Prevent going into future? allowing for now.
    this.currentDate = newDate;
    this.updateTrendChart();
  }

  updateTrendChart() {
    // Helper for local date keys to avoid UTC shifts
    const getLocalKey = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // 1. Determine Date Range and Categories
    let startDate: Date;
    let endDate: Date;
    const categories: string[] = [];
    const dataMap = new Map<
      string,
      { positive: number; neutral: number; negative: number }
    >();

    if (this.viewMode === 'WEEK') {
      // WEEK VIEW: Day by Day (Lun - Dom)
      const day = this.currentDate.getDay();
      const diff = this.currentDate.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(this.currentDate);
      startDate.setDate(diff);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);

      this.dateRangeLabel = `${startDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
      })} - ${endDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
      })}`;

      const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
      weekDays.forEach((d, i) => {
        categories.push(d);
        const dObj = new Date(startDate);
        dObj.setDate(startDate.getDate() + i);
        const key = getLocalKey(dObj);
        dataMap.set(key, { positive: 0, neutral: 0, negative: 0 });
      });
    } else {
      // MONTH VIEW: Aggregate by Weeks (Semana 1 - 5)
      startDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        1
      );
      endDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        0
      );
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      this.dateRangeLabel = startDate.toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric',
      });

      // Fixed 5 buckets for weeks (1-7, 8-14, 15-21, 22-28, 29-31)
      for (let i = 0; i < 5; i++) {
        categories.push(`Semana ${i + 1}`);
        dataMap.set(`week-${i}`, { positive: 0, neutral: 0, negative: 0 });
      }
    }

    // 2. Aggregate Data
    this.enrichedHistory.forEach((item) => {
      if (item.date >= startDate && item.date <= endDate) {
        let key = '';
        if (this.viewMode === 'WEEK') {
          // Key is exact date YYYY-MM-DD
          key = getLocalKey(item.date);
        } else {
          // Key is week bucket index
          const dayOfMonth = item.date.getDate();
          const weekIndex = Math.floor((dayOfMonth - 1) / 7);
          // Ensure 31st goes to last bucket (should be index 4)
          key = `week-${weekIndex > 4 ? 4 : weekIndex}`;
        }

        if (dataMap.has(key)) {
          const counts = dataMap.get(key)!;
          if (item.sentiment === 'POSITIVE') counts.positive++;
          else if (item.sentiment === 'NEUTRAL') counts.neutral++;
          else if (item.sentiment === 'NEGATIVE') counts.negative++;
        }
      }
    });

    // 3. Prepare Series from Map
    const positiveData: number[] = [];
    const neutralData: number[] = [];
    const negativeData: number[] = [];

    dataMap.forEach((counts) => {
      positiveData.push(counts.positive);
      neutralData.push(counts.neutral);
      negativeData.push(counts.negative);
    });

    this.lineSeries = [
      { name: 'Positivo', data: positiveData },
      { name: 'Neutro', data: neutralData },
      { name: 'Negativo', data: negativeData },
    ];

    // 4. Update Chart Options
    this.lineChart = {
      type: 'area',
      height: 320,
      toolbar: { show: false },
      animations: { enabled: true },
    };

    this.trendXAxis = {
      categories: categories,
      labels: { style: { colors: '#ffffff' } },
      tooltip: { enabled: false },
    };

    this.trendYAxis = {
      labels: {
        style: { colors: '#ffffff' },
        formatter: (val: number) => Math.floor(val).toString(),
      },
      min: 0,
      forceNiceScale: true,
      decimalsInFloat: 0,
    };
  }

  trendXAxis: any = {
    categories: [],
    labels: { style: { colors: '#ffffff' } },
    tooltip: { enabled: false },
  };
}
