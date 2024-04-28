import { Component } from '@angular/core';
import { HistoryService } from '../../../services/history.service';

@Component({
  selector: 'app-vaccine-details',
  templateUrl: './vaccine-details.component.html',
  styleUrl: './vaccine-details.component.css'
})
export class VaccineDetailsComponent {
  vaccineId: string = '';
  vaccineHistory: any;
  constructor(private historyService:HistoryService){}
  viewHistory(): void {
      this.historyService.getHistory(this.vaccineId).subscribe(res=>{
        this.vaccineHistory =res;
      });
  }
}
