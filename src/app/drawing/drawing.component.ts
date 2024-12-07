import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class DrawingComponent implements OnInit {
  @ViewChild('drawingCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  
  private context!: CanvasRenderingContext2D;
  
  isDrawing = false;
  currentColor = '#000000';
  
  ngOnInit() {
    this.context = this.canvas.nativeElement.getContext('2d')!;
    this.context.lineWidth = 2;
    this.context.lineCap = 'round';
  }
  
  startDrawing(event: MouseEvent) {
    this.isDrawing = true;
    this.draw(event);
  }
  
  draw(event: MouseEvent) {
    if (!this.isDrawing) return;
    
    const canvas = this.canvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.context.lineTo(x, y);
    this.context.strokeStyle = this.currentColor;
    this.context.stroke();
    this.context.beginPath();
    this.context.moveTo(x, y);
  }
  
  stopDrawing() {
    this.isDrawing = false;
    this.context.beginPath();
  }
  
  updateColor(event: Event) {
    const input = event.target as HTMLInputElement;
    this.currentColor = input.value;
  }
  
  clearCanvas() {
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d')!;
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
}
