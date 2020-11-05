import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-examples',
  templateUrl: './examples.component.html',
})
export class ExamplesComponent {
  constructor(public router: Router) {
  }
}
