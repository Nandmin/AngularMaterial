import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, take } from 'rxjs';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';
import { MessageService } from '../../service/message.service';

@Component({
  selector: 'app-editable',
  templateUrl: './editable.component.html',
  styleUrls: ['./editable.component.scss']
})
export class EditableComponent implements OnInit, OnDestroy {

  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  displayedColumns: string[] = [
    'id',
    'first_name',
    'last_name',
    'gender',
    'email',
    'address',
    'actions'
  ];

  // lapozón elemek száma
  pageSizes: number[] = [5, 10, 25, 100];
  dataSubscription: Subscription | any;
  currentFilterKey: string | any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;

  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService
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
      .watcher$
      .subscribe(
        (users: User) => (this.dataSource.data = users as unknown as User[])
      );
      this.userService.refresh();

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

  onEdit(user: User):void {
    // ha nem a navigatebyurl-t választjuk, akkor tömbben kell felsorolni az url részeit
    this.router.navigate(['editable', 'edit', user.id])
  }

  onDelete(user: User): void {

    const dialogData = {
      title: 'Biztos vagy benne?',
      content: 'Az adatok véglegesen törölve lesznek!'
    };

    this.messageService.openDialog(dialogData).pipe(
      // csak 1szer fog adatot adni
      take(1)
    ).subscribe(
      result => {
        if (!result) {
          // akkor nincs result, amikor a dialogbox-ban a cancelre kattintanak, mert nincs visszajövő adat
          return;
        }
        this.userService.delete(user.id).toPromise().then(
          response => console.log(response),
          err => console.error(err)
        );
      }
    );
  }
}
