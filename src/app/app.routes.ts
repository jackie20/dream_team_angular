import { Routes } from '@angular/router';
import { StockDashboardComponent } from './stock-dashboard/stock-dashboard.component'; // Import your component

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Redirect to dashboard
    { path: 'dashboard', component: StockDashboardComponent }, // Define the dashboard route
    // You can add other routes here if needed
  ];
