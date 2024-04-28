import { Component } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  selectedBrand = "";
  selectedTransaction = "";
  brands = ["Pfizer", "J&J", "Medico"]
  transactions = ["CREATED", "VIOLATION_TEMP", "VIOLATION_OPEN"]
}
