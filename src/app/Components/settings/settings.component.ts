import { Component, OnInit } from '@angular/core';
import { Module } from 'ag-grid-community';
import { ConnectService } from 'src/app/Services/connect.service';
import { VariablesService } from 'src/app/Services/variables.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  columnDefs = [
  ]
  rowData = [];
  defaultColDef={};
  modules:Module[];

  constructor(private cnct:ConnectService,private vars:VariablesService) { }


  ngOnInit(): void {
  }

  
}
