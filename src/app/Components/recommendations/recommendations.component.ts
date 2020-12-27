import { Component, OnInit } from '@angular/core';
import { format } from 'path';
import { RecommendationType } from 'src/app/Classes/recommendation-type';
import { ConnectService } from 'src/app/Services/connect.service';
import { VariablesService } from 'src/app/Services/variables.service';
import { Module } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css'],
  providers:[DatePipe]
})
export class RecommendationsComponent implements OnInit {

  defaultColDef={};
  modules:Module[];
  private gridColumnApi;

  columnDefs = [
    {headerName: 'תאריך', rowDrag: true, field: 'dtCreateDate', sortable: true, filter: true, width:100 },
    {headerName: 'קופת חולים', field: 'nvCatItemName1' , sortable: true, filter: true, width:80},
    {headerName: 'יישוב', field: 'nvCatItemName2', sortable: true, filter: true, width:80},
    {headerName: 'מרפאה', field: 'nvCatItemName3', sortable: true, filter: true, width:80 },
    {headerName: 'שם הרופא', field: 'nvCatItemName4', sortable: true, filter: true, width:80 },
    {headerName: 'אדיבות', field: 'kindnessType', sortable: true, filter: true, width:80 },
    {headerName: 'אנושיות', field: 'humanityType' , sortable: true, filter: true, width:80},
    {headerName: 'גמישות', field: 'flexibilityType' , sortable: true, filter: true, width:80},
    {headerName: 'תוכן ההמלצה', field: 'recommendation' , sortable: true, filter: true, width:80 ,
    onCellClicked:this.cellClick.bind(this)},
    {headerName: 'תמונה', field: 'filePath', sortable: true, filter: true, width:80 },
    {headerName: 'שם ממליץ', field: 'recommanderName' , sortable: true, filter: true, width:80},
    {headerName: 'כתובת', field: 'address', sortable: true, filter: true, width:80 },
    {headerName: 'נייד', field: 'phone' , sortable: true, filter: true, width:80},
    {headerName: 'דוא"ל', field: 'mail', sortable: true, filter: true, width:80 },
    {headerName: 'מעוניין לקבל עדכונים', field: 'reciveMail' , sortable: true, filter: true, width:80},
    {headerName: 'טלפון נוסף', field: 'otherPhone' , sortable: true, filter: true, width:80},
    {headerName: 'מקור ההצבעה', field: 'nvSource', sortable: true, filter: true, width:80 },
  ];

  rowData = [];

  constructor(private http: HttpClient,private cnct:ConnectService, public vars:VariablesService, public datepipe: DatePipe) {
    this.defaultColDef = { resizable: true };

   }
   

  ngOnInit(): void {
    var currentYear = 2020;
    var myDate = new Date();
    this.cnct.post('GetRecommendations',{ iYearId: currentYear })
    .then(
      res=>{
        if(res){
          this.vars.tableInfo.data = [];
          res.forEach(function(r) {
            myDate=r.dtCreateDate.split('(')[1].split(')')[0].split('+')[0];
            let type = r.nvFilePath && r.nvFilePath != '' ? r.nvFilePath.split('.')[r.nvFilePath.split('.').length - 1] : null;
                this.vars.tableInfo.data.push({
                dtCreateDate: this.datepipe.transform(myDate,'HH:mm dd/MM/yy'),
                nvCatItemName1: r.lObject[0].Value, 
                nvCatItemName2: r.lObject[1].Value,
                nvCatItemName3: r.lObject[2].Value,
                nvCatItemName4: r.lObject[3].Value,
                kindnessType: RecommendationType[r.iKindnessType] ? RecommendationType[r.iKindnessType] : '',
                humanityType: RecommendationType[r.iHumanityType] ? RecommendationType[r.iHumanityType] : '',
                flexibilityType: RecommendationType[r.iFlexibilityType] ? RecommendationType[r.iFlexibilityType] : '',
                recommendation: r.nvRecommendation ? r.nvRecommendation : '',
                filePath: r.nvFilePath && r.nvFilePath != '' ? this.cnct.getFileFolderUrl() + r.nvFilePath : null,
                isFileImageType: type == 'png' || type == 'jpg' || type == 'jpeg',
                recommanderName: r.nvFirstName + ' ' + r.nvLastName,
                identityCard: r.identityCard ? r.identityCard : '',
                address: r.nvAddress ? r.nvAddress : '',
                phone: r.nvPhone ? r.nvPhone : '',
                mail: r.nvMail ? r.nvMail : '',
                reciveMail: r.bInterestedReciveEmail == true ? 'כן' : '',
                otherPhone: r.nvOtherPhone ? r.nvOtherPhone : '',
                nvSource: r.nvSource ? r.nvSource : ''
            });
        }, this);
        
        this.rowData=this.vars.tableInfo.data;
        //this.modules = AllCommunityModules;
        }
      }
    )
  
  }
  
  cellClick(item){ 
    this.vars.item=item.data;
    this.vars.bShowRecommendation=!this.vars.bShowRecommendation; 
  }
}
