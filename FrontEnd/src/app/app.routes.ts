import { Routes } from '@angular/router';
import { SentimentComponent } from './features/sentiment/sentiment.component';

export const routes: Routes = [
  { path: '', component: SentimentComponent },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
];
