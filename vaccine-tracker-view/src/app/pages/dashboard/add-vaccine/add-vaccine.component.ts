import { Component } from '@angular/core';
import { NotifierService } from 'angular-notifier/lib/services/notifier.service';
import { AddVaccineService } from '../../../services/add-vaccine.service';

@Component({
  selector: 'app-add-vaccine',
  templateUrl: './add-vaccine.component.html',
  styleUrl: './add-vaccine.component.css'
})
export class AddVaccineComponent {
  showPopup = false;
  constructor(private addVaccineService:AddVaccineService){

  }

  ngOnInit(){
  }
  vaccineDetails = {
    vaccine:
    {
      vaccineId: '',
      containerId:'',
      threshold: {
        temperature: '',
        humidity: '',
      },
      brand: ''
    }
  }

  showNotification(){
    this.showPopup = true;
    setTimeout(() => {
      this.showPopup = false;
    }, 3000);
  }
  addVaccine(){
    console.log(this.vaccineDetails);
    this.addVaccineService.addVaccine(this.vaccineDetails).subscribe();
    this.showNotification();

  }

}
