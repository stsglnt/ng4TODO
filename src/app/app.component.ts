import {Component, OnInit, OnDestroy} from '@angular/core';
import {TodoService} from './services/todo.service';
import {ITodos} from './models/todos';
import * as moment from 'moment';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public taskValue: string | number;
  public todos: ITodos[];
  public dateValue: any;
  public selectedAll: boolean;
  private todosSubscription: Subscription;
  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.selectedAll = false;
    this.getTodos();
  }

  ngOnDestroy() {
    this.todosSubscription.unsubscribe();
  }

  public getTodos() {
    this.todosSubscription = this.todoService.getTodos()
      .subscribe(res => {
        this.todos = res;
      },
        error => {
        console.log('Something went wrong', error);
        });
  }
  public addTodo(task, date?) {
    if (this.taskValue && this.dateValue) {
      const formatedDate = moment(this.dateValue).format('DD.MM.YYYY');
      const preSend: ITodos = {
        task: task,
        date_time: formatedDate,
        done: false,
        selected: false,
        id: this.todoService.generateId(10)
      };
      this.todoService.addTodo(preSend);
      this.taskValue = '';
    }
  }

  public deleteTodo(todo: ITodos) {
    this.todoService.deleteTodo(todo);
  }
  public checkAsDone(todo: ITodos, event) {
    const preSend: ITodos = {
      task: todo.task,
      date_time: todo.date_time,
      done: event.checked,
      selected: todo.selected,
      id: todo.id
    };
    this.todoService.updateTodo(preSend);
  }
  public checkAsSelected(todo: ITodos, event) {
    const preSend: ITodos = {
      task: todo.task,
      date_time: todo.date_time,
      done: todo.done,
      selected: event.checked,
      id: todo.id
    };
    this.todoService.updateTodo(preSend);
  }
  public onDateUpdate(event) {
    this.dateValue = event.value;
  }
  public selectOneTask(todo, event) {
    this.checkAsSelected(todo, event);
  }
  public selectAllTask(event) {
    this.todos.forEach(todo => {
      todo.selected = event.checked;
    });
    this.todoService.updateAllTodo(event.checked);
  }
  public deleteSelected() {
    this.todoService.deleteAllSelectedTodo();
    this.selectedAll = false;
  }
}

