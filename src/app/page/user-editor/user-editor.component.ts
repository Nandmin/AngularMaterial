import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { User } from 'src/app/model/user';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class UserEditorComponent implements OnInit {

  user$!: Observable<User | any>;
  genders: string[] = ['Male', 'Female'];

  constructor(
    private UserService: UserService,
    private ar: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.user$ = this.ar.params.pipe(
      switchMap(params => this.UserService.get(params['id']) as Observable<User>)
    );
  }

  formatLabel(value: number): string {
    return Math.round(value / 1000) + 'k';
  }

  // ha async egy fv, az mindig promist ad vissza
  async onSubmit(ngForm: NgForm, user: User): Promise<any> {
    console.log(ngForm.value);
    await this.UserService.update(user.id, ngForm.value).toPromise();
    return history.back();
  }

}
