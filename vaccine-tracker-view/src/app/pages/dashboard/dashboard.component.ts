import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent  {


  selected: number = 0;
  changeSection(selectedSection: number){
    this.selected = selectedSection;
  }
}
