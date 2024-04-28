import { Component } from '@angular/core';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {
  results = [
    {
      vaccineId: "vaccine1",
      containerId: "container1",
      brand: "Pfizer",
      owner: "Sumon",
      threshold: {
        temp: "4C",
        humidity: "80%"
      },
      transaction: "CREATED"
    },
    {
      vaccineId: "vaccine1",
      containerId: "container1",
      brand: "Pfizer",
      owner: "Sumon",
      threshold: {
        temp: "4C",
        humidity: "80%"
      },
      transaction: "CREATED"
    },
    {
      vaccineId: "vaccine1",
      containerId: "container1",
      brand: "Pfizer",
      owner: "Sumon",
      threshold: {
        temp: "4",
        humidity: "80"
      },
      transaction: "CREATED"
    }
  ]
}
