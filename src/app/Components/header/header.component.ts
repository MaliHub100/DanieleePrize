import { Component, OnInit } from '@angular/core';
import { RoutingService } from 'src/app/Services/routing.service'
import { VariablesService } from 'src/app/Services/variables.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private navigateSer:RoutingService, public vars:VariablesService) { 
    if(vars.isLogin)
    this.navigateSer.moveToPage('/recommendations');
  }

  ngOnInit(): void {
    
  }

  moveToPage(pageName:string) {
    this.navigateSer.moveToPage(pageName);
  }
  logout(){
    localStorage.removeItem('danieleePrizeUser');
    this.vars.isLogin = false;
    this.navigateSer.moveToPage('/');
  }
}
