import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent implements OnInit{
  showPopup = false;
  owner = environment.owner;

  vaccineIdReq: string = '';
  incomingRequests:any;
  constructor(private requestService: RequestService) {

  }
  ngOnInit(){
    this.requestService.getIncomingRequests().subscribe(requests => {
      this.incomingRequests = requests;

      console.log(this.incomingRequests);

    });
  }
  submitRequest(){
    this.requestService.requestTransfer(this.vaccineIdReq).subscribe();
    this.showPop();

  }
  showPop(){
    this.showPopup = true;
    setTimeout(() => {
      this.showPopup = false;
    }, 3000);
  }
  acceptRequest(vaccineId:any ){
    this.requestService.acceptRequest(vaccineId).subscribe();
    const index = this.incomingRequests.findIndex((request: any) => request.vaccineId === vaccineId);

    this.incomingRequests.splice(index);
  }
}
