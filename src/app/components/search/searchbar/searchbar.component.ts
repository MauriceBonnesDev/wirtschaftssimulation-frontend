import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {fromEvent, Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, tap, switchMap} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {SearchService} from '../../../services/search.service';
import {Asset} from '../../../interfaces/asset';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {
  @Output()
  searchEvent: EventEmitter<string> = new EventEmitter<string>();
  constructor(private searchService: SearchService) { }

  ngOnInit(): void {}
  searching(term: string): void {
    this.searchEvent.emit(term);
  }
}
