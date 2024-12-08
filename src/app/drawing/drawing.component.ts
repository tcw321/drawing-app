import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drawing',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.css']
})
export class DrawingComponent implements OnInit {
  @ViewChild('drawingCanvas') canvas!: ElementRef<HTMLCanvasElement>;
  private context!: CanvasRenderingContext2D;
  private startPoint: { x: number; y: number } | null = null;
  
  isDrawing = false;
  currentColor = '#000000';
  lineWidth = 2;
  drawingMode: 'freehand' | 'line' = 'freehand';
  
  ngOnInit() {
    const canvas = this.canvas.nativeElement;
    this.context = canvas.getContext('2d')!;
    this.context.lineWidth = this.lineWidth;
    this.context.lineCap = 'round';
  }
  
  startDrawing(event: MouseEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.isDrawing = true;
    this.context.beginPath();
    this.context.moveTo(x, y);

    if (this.drawingMode === 'line') {
      this.startPoint = { x, y };
    }
  }
  
  draw(event: MouseEvent) {
    if (!this.isDrawing) return;
    
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (this.drawingMode === 'freehand') {
      this.context.lineTo(x, y);
      this.context.stroke();
    } else if (this.drawingMode === 'line' && this.startPoint) {
      // Clear the canvas to remove the preview line
      const imageData = this.context.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.context.putImageData(imageData, 0, 0);

      // Draw the preview line
      this.context.beginPath();
      this.context.moveTo(this.startPoint.x, this.startPoint.y);
      this.context.lineTo(x, y);
      this.context.stroke();
    }
  }
  
  stopDrawing() {
    this.isDrawing = false;
    this.startPoint = null;
  }
  
  updateColor(event: Event) {
    const input = event.target as HTMLInputElement;
    this.currentColor = input.value;
  }
  
  updateLineWidth(event: Event) {
    const input = event.target as HTMLInputElement;
    this.lineWidth = parseInt(input.value);
    if (this.context) {
      this.context.lineWidth = this.lineWidth;
    }
  }

  setDrawingMode(mode: 'freehand' | 'line') {
    this.drawingMode = mode;
  }
  
  clearCanvas() {
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d')!;
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
}
