import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit, OnDestroy {
    dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
    displayedColumns: string[] = [
      'id',
      'first_name',
      'last_name',
      'gender',
      'email',
      'address',
    ];

    // lapozón elemek száma
    pageSizes: number[] = [5, 10, 25, 100];
    dataSubscription: Subscription | any;
    currentFilterKey: string | any;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;

    constructor(private userService: UserService
      )  {}

    applyFilter(event: Event): void {
      // kiolvasom az input elem értékét
      const filterValue = (event.target as HTMLInputElement).value;
      // minden módosuláskor módosul a filter értéke
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
      
    ngOnInit(): void {
      this.dataSource.paginator = this.paginator;
      this.dataSubscription = this.userService
        .get()
        .subscribe(
          (users) => (this.dataSource.data = users as unknown as User[])
        );

      // a datasource vizsgálja a =-ben lévő állítást. ha igaz benne marad, ha nem, kidobja
        this.dataSource.filterPredicate = (data: User, filter: string) => {
          const key = this.currentFilterKey || '';
          const soruce = key ? String(data=key) : JSON.stringify(data);
          return soruce.toLowerCase().includes(filter);
        }
    }
    //leiratkozáshoz
    ngOnDestroy(): void {
      this.dataSubscription.unsubscribe();
    }
}
