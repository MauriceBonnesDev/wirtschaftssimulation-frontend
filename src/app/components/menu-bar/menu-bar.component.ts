import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent implements OnInit {

  menuOpen = false;
  menuDropdown = false;
  menuDropdownOpen = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    this.menuDropdownOpen = !this.menuDropdownOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.menuDropdown = window.innerWidth < 1250;
  }
}
