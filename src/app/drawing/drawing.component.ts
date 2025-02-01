import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drawing',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.css']
})
export class DrawingComponent implements AfterViewInit {
  @ViewChild('drawingCanvas') canvas!: ElementRef<HTMLCanvasElement>;
  private context!: CanvasRenderingContext2D;
  private startPoint: { x: number; y: number } = { x: 0, y: 0 };
  private lastImageData: ImageData | null = null;
  
  isDrawing = false;
  currentColor = '#000000';
  lineWidth = 2;
  drawingMode: 'freehand' | 'line' = 'freehand';
  
  ngAfterViewInit() {
    const canvas = this.canvas.nativeElement;
    this.context = canvas.getContext('2d')!;
    this.context.lineWidth = this.lineWidth;
    this.context.lineCap = 'round';
  }
  
  startDrawing(event: MouseEvent) { 
    this.isDrawing = true;
    if (this.drawingMode === 'line') {
      this.startPoint = {
        x: event.clientX,
        y: event.clientY
      };
    }
  }
 
  draw(event: MouseEvent) {
    if (!this.isDrawing ||
      (this.drawingMode === 'line'))
      {
        this.context.beginPath();
        if (this.drawingMode === 'line') {
          const rect = this.canvas.nativeElement.getBoundingClientRect();
          this.context.moveTo(this.startPoint.x - rect.left, this.startPoint.y - rect.top);
          return;
        }
      }
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
  
    this.context.lineTo(x, y);
    this.context.strokeStyle = this.currentColor;
    this.context.stroke();
    this.context.beginPath();
    this.context.moveTo(x, y);
  
  }
  
  stopDrawing(event: MouseEvent) {
    this.isDrawing = false;
    if (this.drawingMode === 'line' && this.startPoint) {
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const endX = event.clientX - rect.left;
      const endY = event.clientY - rect.top;
      
      this.context.beginPath();
      this.context.moveTo(this.startPoint.x - rect.left, this.startPoint.y - rect.top);
      this.context.lineTo(endX, endY);
      this.context.strokeStyle = this.currentColor;
      this.context.stroke();
    }
    this.startPoint = { x: 0, y: 0 };
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
    this.context.clearRect(0, 0, canvas.width, canvas.height);
    this.startPoint = { x: 0, y: 0 };
    this.lastImageData = null;
  }
  
}
