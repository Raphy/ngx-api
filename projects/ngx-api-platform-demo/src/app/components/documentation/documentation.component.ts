import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
})
export class DocumentationComponent {
  constructor(public router: Router) {
  }
}
