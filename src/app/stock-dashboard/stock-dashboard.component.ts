import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { HttpClientModule, HttpClient } from '@angular/common/http'; // Import HttpClientModule and HttpClient

// Register all components of Chart.js
Chart.register(...registerables);

interface DailyStockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
interface StockData {
  [date: string]: DailyStockData; // Index signature for dynamic date keys
}

 

@Component({
  selector: 'app-stock-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule], // Import HttpClientModule here
  templateUrl: './stock-dashboard.component.html',
  styleUrls: ['./stock-dashboard.component.css']
})
export class StockDashboardComponent {
  companies = ['MSFT', 'AAPL', 'NFLX', 'FB', 'AMZN'];
  selectedCompany: string = this.companies[0]; // Default selection
  stockData: DailyStockData[] = [];

  pieChart: Chart<'pie'> | null = null; // Specify the chart type here

  constructor(private http: HttpClient) { } // Inject HttpClient

  fetchStockData() {
    console.log('Fetching data for:', this.selectedCompany);
   
 
    this.http.get<any>(`https://localhost:7228/api/Stock/${this.selectedCompany}`)
    .subscribe({
      next: (response) => {
        const timeSeries = response['Time Series (Daily)'];
        if (timeSeries) {
          this.stockData = Object.keys(timeSeries).map(date => {
            const dailyData = timeSeries[date];
            return {
              date: date,
              open: parseFloat(dailyData['1. open']),
              high: parseFloat(dailyData['2. high']),
              low: parseFloat(dailyData['3. low']),
              close: parseFloat(dailyData['4. close']),
              volume: parseInt(dailyData['5. volume'], 10)
            };
          });
          this.renderPieChart();
        } else {
          console.error('No time series data found in response');
        }
      },
      error: (error) => {
        console.error('Error fetching stock data', error);
      }
    });
 
  }

  renderPieChart() {
    if (this.pieChart) {
      this.pieChart.destroy(); // Destroy existing chart instance if it exists
    }

    // Check if stockData is not null before proceeding
    if (this.stockData) {

      const closePrices = this.stockData.map(data => data.close);
      const labels = this.stockData.map(data => data.date);

 

      this.pieChart = new Chart<'pie'>('pieChart', {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            label: 'Close Prices',
            data: closePrices,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Company Close Prices Pie Chart'
            }
          }
        }
      });
    } else {
      console.error('No stock data available for chart rendering.');
    }
  }
}
