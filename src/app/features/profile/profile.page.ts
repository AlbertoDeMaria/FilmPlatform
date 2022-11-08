import { User } from './../../model/user';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  template: `

  <mat-tab-group mat-align-tabs="start">
    <mat-tab label="INFO">
      <div class="pt-3">
        <table class="w-100 text-center">
        	<tbody>
        		<tr>
        			<td>Nome: {{user.name}}</td>
        		</tr>
        		<tr>
        			<td>Email: {{user.email}}</td>
        		</tr>
        	</tbody>
        </table>
      </div>
    </mat-tab>
  </mat-tab-group>


  `,
  styles: []
})
export class ProfileComponent implements OnInit {

  constructor(private authSrv:AuthService) { }

  sub!:Subscription
  user!:User;

  ngOnInit(): void {
    this.sub = this.authSrv.user$.subscribe((ris=>{
      this.user = ris!.user;
    }));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
