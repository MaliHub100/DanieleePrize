import { Component, OnInit } from '@angular/core';
import { VariablesService } from 'src/app/Services/variables.service';

@Component({
  selector: 'app-global-dialog',
  templateUrl: './global-dialog.component.html',
  styleUrls: ['./global-dialog.component.css']
})
export class GlobalDialogComponent implements OnInit {

  constructor(public vars:VariablesService) { }

  ngOnInit(): void {
  }

  confirmFunc(){

  }

  cancelFunc(){

  }

}
