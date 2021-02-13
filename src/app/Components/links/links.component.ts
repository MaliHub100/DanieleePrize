import { SelectorMatcher } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ConnectService } from 'src/app/Services/connect.service';
import { VariablesService } from 'src/app/Services/variables.service';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit {
  columnDefs = [
    {headerName: '', rowDrag: true, field: '',template: '<span class="Btn btn-danialli" style="cursor: pointer;">עריכה</span>',
    onCellClicked:this.editLink.bind(this)	,
     sortable: true, filter: true, width:100 },
    {headerName: 'קוד', field: 'iLinkId' , sortable: true, filter: true, width:80},
    {headerName: 'קופה', field: 'nvHMO', sortable: true, filter: true, width:80},
    {headerName: 'מקור', field: 'nvSource', sortable: true, filter: true, width:120},
    {headerName: 'לינק', field: 'nvLink', sortable: true, filter: true, width:500 },
    {headerName: 'הצבעות ללינק', field: 'iCount', sortable: true, filter: true, width:80 },
  ];

  rowData = [];
  defaultColDef={};
  toChangeLink;
  link;
  lHMOs;
  
 
  constructor(private cnct:ConnectService, private vars:VariablesService) {
    this.defaultColDef = { resizable: true };
    
   }

  ngOnInit(): void {
    this.getLinks();
    this.getHMOs();
  }
    
  getLinks(){
    this.cnct.post('GetLinks', {})
      .then(
        res => {
          if (res) {
            this.vars.tableInfo.data = [];
            res.forEach(function (r) {
              this.vars.tableInfo.data.push({
                iLinkId: r.iLinkId,
                nvHMO: r.nvHMO ? r.nvHMO : '',
                nvSource: r.nvSource ? r.nvSource : '',
                nvLink: r.nvLink ? r.nvLink : '',
                iCount: r.iCount ? r.iCount : 0

              });
            }, this);
            this.rowData = this.vars.tableInfo.data;
          }
        });
  }

  getHMOs() {
    this.cnct.post('GetHMOs', {})
      .then(
        res => {
          if (res) {
            this.lHMOs = res;
          }
          else {
            this.vars.globalDialog = { type: 'error', title: 'אירעה שגיאה בלתי צפויה' };
          }
        });
  }
  editLink(item){
    this.link=item.data;
    this.link.iHMOType = this.link.nvHMO!=''?this.lHMOs.filter(h=>h.nvSetting==this.link.nvHMO)[0].iSettingId:-1;
    this.toChangeLink=true;
  }

  closeDialog(){
    this.toChangeLink=null;
  }

  saveLink(){
    if(!this.link.nvSource) return;
    this.cnct.post('LinkInsertUpdate', { 'link':this.link, 'iUserId': this.vars.user.iUserId }).then(
      res=>{
        if(res&&res>0){
          this.vars.globalDialog={type:'success',title:'נשמר בהצלחה' };
          this.toChangeLink=null;
          this.getLinks();
        }
        else{
          this.vars.globalDialog={type:'error',title:'אירעה שגיאה בלתי צפויה' };
        }

      }
    ),function () {
     this.vars.globalDialog = { type: 'error', title: 'אירעה שגיאה בלתי צפויה' };
  }
  }

  newLink(){
    this.link = {
      iLinkId: -1,
      nvLink: '',
      nvSource: '',
      iHMOType: -1
  };
    this.toChangeLink = true;
  }
}
