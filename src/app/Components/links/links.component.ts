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

  constructor(private cnct:ConnectService, private vars:VariablesService) {
    this.defaultColDef = { resizable: true };
   }

  ngOnInit(): void {
    this.cnct.post('GetLinks',{ })
    .then(
      res=>{
        if(res){
          this.vars.tableInfo.data = [];
          res.forEach(function(r) {
            this.vars.tableInfo.data.push({
              iLinkId: r.iLinkId,
              nvHMO: r.nvHMO ? r.nvHMO : '',
              nvSource: r.nvSource ? r.nvSource : '',
              nvLink: r.nvLink ? r.nvLink : '',
              iCount: r.iCount ? r.iCount : 0

          });
      }, this);
      this.rowData=this.vars.tableInfo.data;
    }
  });
}

  editLink(item){
    this.vars.link=item.data;
    this.vars.toChangeLink=true;
  }

  closeDialog(){
    this.vars.toChangeLink=null;
  }

  saveLink(){
    if(!this.vars.link.nvSource) return;
    this.cnct.post('LinkInsertUpdate', { 'link':this.vars.link, 'iUserId': this.vars.user.iUserId }).then(
      res=>{
        if(res&&res>0){
          this.vars.globalDialog={type:'success',title:'נשמר בהצלחה' };
          this.vars.toChangeLink=null;
        }
      }
    )
  }

}
