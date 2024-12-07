import { Component } from '@angular/core';
import { DrawingComponent } from './drawing/drawing.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [DrawingComponent]
})
export class AppComponent {
  title = 'drawing-app';
}
