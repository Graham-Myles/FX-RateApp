import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title: string = 'FX-RateApp';
  date: string = '';
  amount: number = 0;
  fromCurrency: string = 'GBP';
  toCurrency: string = 'USD';
  convertedAmount: number = 0;

  constructor(private http: HttpClient) {}

  convert() {
    const queryParams = `?date=${this.date}&from=${this.fromCurrency}&to=${this.toCurrency}`;
    this.http.get<any>(`http://localhost:3000/rate${queryParams}`).subscribe(response => {
      const rate = response.rate;
      this.convertedAmount = this.amount * rate;
    }, error => {
      console.error('Error fetching rate:', error);
    });
  }
}
