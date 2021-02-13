import { Component, OnInit } from '@angular/core';
import { Module } from 'ag-grid-community';
import { timeStamp } from 'console';
import { ConnectService } from 'src/app/Services/connect.service';
import { VariablesService } from 'src/app/Services/variables.service';
import { Year } from 'src/app/Classes/year';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  columnDefs = [];
  rowData = [];
  defaultColDef={};
  modules:Module[];
  oYear:Year=null;
  categoryCount=0;
  currentCategoryType;
    dBeginDate: Date;
    dEndDate: Date;

  constructor(private cnct:ConnectService,private vars:VariablesService) { 
    this.defaultColDef = { resizable: true };
  }


  ngOnInit(): void {
    this.vars.tableInfo.columns=[];
    this.vars.tableInfo.data = [];
    this.cnct.post( 'GetYears', {}).then((result)=> {
      if (result) {
          var obj;
          result.forEach(r => {
              obj = this.addColumn({}, r.lCategoryType, 'category', '');
              obj['yearId'] = r.iYearId;
              obj['mainText'] = r.nvMainText;
              this.vars.tableInfo.data.push(obj);
          });

          this.vars.tableInfo.columns.forEach(c => {
              c.width = 150;
          });

          this.vars.tableInfo.columns.unshift({
              headerName: 'שנה',
              field: 'yearId',
              filter: true,
              sortable: true,
              width: 100
          });
          this.vars.tableInfo.columns.unshift({
              headerName: 'עריכה',
               template: '<div><img src="../assets/Images/edit.png" style="height: 20px"/></div>',
              filter: true,
              sortable: true,
              width: 100,
              export: false,
               onCellClicked:this.openDialog.bind(this)
          });
          this.vars.tableInfo.columns.push({
              headerName: 'טקסט הקדמה לטופס',
              field: 'mainText',
              width: 320
          });

          this.vars.tableInfo.currentData = this.vars.tableInfo.data;
          this.rowData=this.vars.tableInfo.data;
          this.columnDefs=this.vars.tableInfo.columns;

      }
  },
  (err)=> {
      this.vars.globalDialog = { type: 'error', title: 'אירעה שגיאה בלתי צפויה' };
  });
  }
   addColumn(obj, list, column, level) {
    var levelTxt = level;
    for (let i = 0; i < list.length; i++) {
        if (!this.vars.tableInfo.columns.find(c => c.field == column + levelTxt.replace(/\./g, '') + (i + 1))) {
            this.vars.tableInfo.columns.push({
                headerName: 'קטגוריה ' + levelTxt + (levelTxt != '' ? '.' + (i + 1) : (i + 1)),
                field: column + levelTxt.replace(/\./g, '') + (i + 1),
                filter: true,
                sortable: true,
                width: '0%'
            });
            this.categoryCount++;
        }
        obj[column + levelTxt.replace(/\./g, '') + (i + 1)] = list[i].nvCatTypeDesc;

        this.addColumn(obj, list[i].lCategoryType, column, levelTxt + (levelTxt != '' ? '.' + (i + 1) : (i + 1)));
    }
    return obj;
}

openDialog(rowData){
    this.openDialogInner(rowData ? rowData.data.yearId : rowData);
}
closeCurrentCategoryType(categoryNum) {
    for (let i = categoryNum; i <= this.categoryCount; i++) {
        this['currentCategoryType' + (i == 1 ? '' : i)] = null;
    }
}
openDialogInner(iYearId){
        if (iYearId) {
        this.cnct.post('GetYear', { iYearId: iYearId, bCategoryItem: true }).then(
            result => {
                if (result) {
                    this.oYear = result;
                    this.oYear['bNew'] = false;
                } else {
                    this.oYear = new Year(iYearId);
                    this.oYear['bNew'] = true;
                    this.dBeginDate = new Date(this.oYear.iYearId, 0, 1);
                    this.dEndDate = new Date(this.oYear.iYearId, 11, 31);
                }
            },
            err=>{
                this.vars.globalDialog = { type: 'error', title: 'אירעה שגיאה בלתי צפויה' };
            });
    }
     else {
        this.oYear = new Year(null);
        this.oYear['bNew'] = true;
    }
}
closeDialog(){
    this.oYear=null;
}
}