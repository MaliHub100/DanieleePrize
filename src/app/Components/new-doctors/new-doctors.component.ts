import { Component, ContentChild, Input, OnInit } from '@angular/core';
import { Module } from 'ag-grid-community';
import { ConnectService } from 'src/app/Services/connect.service';
import {CategoryType} from 'src/app/Classes/category-type';
import {CategoryItem} from 'src/app/Classes/category-item';
import { VariablesService } from 'src/app/Services/variables.service';
import { getLocaleDateFormat } from '@angular/common';

@Component({
  selector: 'app-new-doctors',
  templateUrl: './new-doctors.component.html',
  styleUrls: ['./new-doctors.component.css']
})

export class NewDoctorsComponent implements OnInit {
  defaultColDef={};
  modules:Module[];
  rowData = [];
  categoryType:CategoryType;
  categoryItem:CategoryItem;
  iCatItemId;
  lCategoryItem;
  constructor(private cnct:ConnectService,public vars:VariablesService) { 
    this.defaultColDef = { resizable: true };
    this.categoryType=vars.categoryType;
    this.categoryItem=vars.categoryItem;
  }

  columnDefs = [
    {headerName: 'אישור', rowDrag: true, field: '', sortable: true, width:120,template: '<span class="glyphicon glyphicon-ok" style="color:#82c755"></span>',
      onCellClicked:this.confirmDoctor.bind(this)},
    // {headerName: 'עריכה',  field: '', sortable: true, width:125 ,template:'<span class="Btn btn-danialli style="cursor: pointer;">עדכן רופא</span>',
    //onCellClicked:this.editDoctor.bind(this)},
    {headerName: 'שם הרופא',  field: 'nvNewDoctorName', sortable: true, filter: true, width:200 },
    {headerName: 'קופת חולים', field: 'nvCompany', sortable: true, filter: true, width:200 },
    {headerName: 'יישוב',  field: 'nvCity', sortable: true, filter: true, width:200 },
    {headerName: 'מרפאה',  field: 'nvClinic', sortable: true, filter: true, width:200 }
  ]
  
  ngOnInit(): void {
    this.getAllDoctors(null);
    this.getData();   
  } 

  getAllDoctors(func){
    this.cnct.post("GetCategoryItemsDoctors",{nvGuide:this.vars.user.nvGuide}).then(
      res=>{
        if(res.Result){
          this.lCategoryItem=res.Result; 
          if(func)
            func();        
        }
        else{
          this.vars.globalDialog={type:'error',title:'אירעה שגיאה בלתי צפויה'};
      }
    }   
    )
  }
  confirmDoctor(item) {
    item=item.data;
    this.cnct.post('ConfirmNewDoctor', { 'iNewDoctorId': item.iNewDoctorId }).then(
      res=>{
        if(res&& res>0){
          this.vars.globalDialog={type:'success',title:'רופא נכנס לרשימת הרופאים'};
            this.getData();
            this.getAllDoctors(null);   
        }
        else{
            this.vars.globalDialog={type:'error',title:'אירעה שגיאה בלתי צפויה' };
        }
      }
    )
  }
 
  getData(){
    this.cnct.post('GetNewDoctors', {nvGuide:this.vars.user.nvGuide}).then(
      res=>{
        if (res.Result) {
          this.vars.tableInfo.data = [];
          if (res.length <= 0)
              this.vars.globalDialog={type:'error',title:'אין נתונים להצגה' };
          else {
              this.vars.tableInfo.data = res.Result;
              this.rowData=this.vars.tableInfo.data;
          }
      }
      else{
        this.vars.globalDialog={type:'error',title:'אירעה שגיאה בלתי צפויה' };   
      }
  })}

  
  
  editDoctor(item){
    this.vars.item=item.data;
    this.vars.toChangeDoctor=true;
  }

  closeDialog(){
    this.vars.toChangeDoctor=null;
  }

  choose(itemSearch){
    this.vars.categoryItem.iCatItemId=itemSearch.iCatItemId;
  }


  saveDoctor(){
    if (this.iCatItemId == null || this.iCatItemId == undefined ||this.iCatItemId== -1) 
        return;
    this.cnct.post('ChangeDoctor', { 'iNewDoctorId': this.vars.item.iNewDoctorId, 'iOldDoctor': this.categoryItem.iCatItemId })
    .then(
      res=>{
        if(res){
          //globalDialog
          this.vars.globalDialog={type:'success',title:'נשמר בהצלחה' };
          this.vars.toChangeDoctor=null;
          this.getData();       
        }
        else{
          this.vars.globalDialog={type:'error',title:'אירעה שגיאה בלתי צפויה' };
        }
      }
    )
    
   
  }
}



