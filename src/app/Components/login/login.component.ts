import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/Classes/user';
import { ConnectService } from 'src/app/Services/connect.service';
import { RoutingService } from 'src/app/Services/routing.service';
import { VariablesService } from 'src/app/Services/variables.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user:User;

  constructor(private cnnct:ConnectService, private vars:VariablesService,private navigateSer:RoutingService) {
    this.user = vars.user;
   }

  ngOnInit(): void {
  }

  login(){
     this.cnnct.post('GetUserByUserNameAndPassword',{ nvUserName: this.vars.user.nvUserName, nvPassword: this.vars.user.nvPassword   })
     .then(res=>
       {
         if(res){
           this.vars.user = res;
           this.vars.isLogin = true;
           localStorage.setItem('danieleePrizeUser', JSON.stringify(this.vars.user));
           this.navigateSer.moveToPage('recommendations');
         }
         else{
          this.vars.globalDialog={type:'error',title:'שם משתמש / סיסמא שגויים נסה שוב' };
         }
       },
       err=>{
        this.vars.globalDialog={type:'error',title:'אירעה שגיאה בלתי צפויה' };
       }
    )
  }
}
