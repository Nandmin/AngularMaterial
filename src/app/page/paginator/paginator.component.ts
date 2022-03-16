import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnDestroy {

  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  displayedColumns: string[] = [
    'id',
    'first_name',
    'last_name',
    'gender',
    'email',
    'address'
  ];

  // lapozón elemek száma
  pageSizes: number[] = [5, 10, 25, 100];
  dataSubscription: Subscription | any;

  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator | any;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSubscription = this.userService.get().subscribe(
      users => this.dataSource.data = (users as unknown as User[])
    );
  }
  //leiratkozáshoz
  ngOnDestroy(): void {
      this.dataSubscription.unsubscribe();
  }

}
