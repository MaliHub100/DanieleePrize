import { Component, OnInit } from '@angular/core';
import { VariablesService } from 'src/app/Services/variables.service';

@Component({
  selector: 'app-my-index',
  templateUrl: './my-index.component.html',
  styleUrls: ['./my-index.component.css']
})
export class MyIndexComponent implements OnInit {

  isLogin:boolean;
  

  constructor(public vars:VariablesService) {
    this.isLogin = vars.isLogin;
  }


  ngOnInit(): void {
  }

}
