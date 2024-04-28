
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Output() onSectionSelected =  new EventEmitter<number>();
  selected = 0
  select(id: number){
    this.selected = id;
    this.onSectionSelected.emit(this.selected);
  }
}
