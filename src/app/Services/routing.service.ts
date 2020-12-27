import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { VariablesService } from './variables.service';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router:Router, private vars:VariablesService) { }

  moveToPage(page:string){
    this.router.navigate(["/"+page]);
    this.navigatePage("/"+page);
  }

  navigatePage(pageName:string){
    this.vars.activePage
    if (this.vars.activePage != pageName) {
      this.vars.activePage = pageName;
    }
  }
  
}
