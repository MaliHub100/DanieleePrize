import { Injectable } from '@angular/core';
import { CategoryItem } from '../Classes/category-item';
import { CategoryType } from '../Classes/category-type';
import { User } from '../Classes/user';
import { ConnectService } from './connect.service';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  // $rootScope.isLogin = false;
  // login.login(JSON.parse(localStorage.getItem('danieleePrizeUser')));

  constructor(private cnnct:ConnectService) { 
    this.isLogin=false;
  //   var u = JSON.parse(localStorage.getItem('danieleePrizeUser'));
  //   if(u){
  //     cnnct.post('GetUserByUserNameAndPassword',{ nvUserName: u.nvUserName, nvPassword: u.nvPassword })
  //     .then(res=>
  //       {
  //         if(res){
  //           this.user = res;
  //           this.isLogin = true;
  //         }
  //         else{
  //           alert('שם משתמש / סיסמא שגויים נסה שוב');
  //         }
  //       },
  //       err=>{
  //         alert(err);
  //       }
  //    )
  //  }
  }
  
  activePage:string='';
  user:User = new User();
  categoryType:CategoryType=new CategoryType();
  categoryItem:CategoryItem=new CategoryItem();
  item;
  globalDialog=null;
  toChangeDoctor:boolean=null;
  isLogin:boolean;
  bShowRecommendation:boolean=false;
  tableInfo={
    data:[],
    columns:[],
    currentData:[]
  };
}

