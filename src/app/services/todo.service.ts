import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {ITodos} from '../models/todos';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class TodoService {

  public todos$: BehaviorSubject<ITodos[]>;
  private todosFromStorage: ITodos[] = [];

  constructor() {
    this.initIfNoStorage();
    this.initTodo();
  }

  private initIfNoStorage () {
    if (!localStorage.getItem('todos')) {
     localStorage.setItem('todos', '[]');
    } else {
      console.log('storage is defined');
    }
  }
  private initTodo() {
    this.todosFromStorage = JSON.parse(localStorage.getItem('todos'));
    this.todos$ = new BehaviorSubject<ITodos[]>(this.todosFromStorage);
    this.todos$.next(this.todosFromStorage);
  }

  public getTodos(): Observable<ITodos[]> {
    return this.todos$.asObservable();
  }
  public addTodo(todo) {
    this.todosFromStorage.push(todo);
    localStorage.setItem('todos', JSON.stringify(this.todosFromStorage));
    this.todos$.next(this.todosFromStorage);
  }
  public updateTodo(todo) {
    this.todosFromStorage.forEach((el, index) => {
      if (todo.task === el.task) {
        el.done = todo.done;
        el.selected = todo.selected;
      }
    });
    localStorage.setItem('todos', JSON.stringify(this.todosFromStorage));
  }
  public updateAllTodo(value) {
    this.todosFromStorage.forEach((el, index) => {
        el.selected = value;
    });
    localStorage.setItem('todos', JSON.stringify(this.todosFromStorage));
  }

  public deleteTodo(todo: ITodos) {
    this.todosFromStorage.forEach((el, index) => {
      if (todo.id === el.id) {
        this.todosFromStorage.splice(index, 1);
      }
    });
    localStorage.setItem('todos', JSON.stringify(this.todosFromStorage));
    this.todos$.next(this.todosFromStorage);
  }
  public deleteAllSelectedTodo() {
    this.todosFromStorage = this.todosFromStorage.filter(todo => !todo.selected);
    localStorage.setItem('todos', JSON.stringify(this.todosFromStorage));
    this.todos$.next(this.todosFromStorage);
  }

  public generateId(length) {
      let id = '';
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < length; i++)  {
        id += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return id;
  }
}
