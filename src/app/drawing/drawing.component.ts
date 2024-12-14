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
  private startPoint: { x: number; y: number } | null = null;
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
    this.draw(event) 
    // if (this.drawingMode === 'line') {
    //   const rect = this.canvas.nativeElement.getBoundingClientRect();
    //   const x = event.clientX - rect.left;
    //   const y = event.clientY - rect.top;
    //   if (!this.startPoint) {
    //     // First click - start the line
    //     this.startPoint = { x, y };
    //     // Save the current canvas state
    //     this.lastImageData = this.context.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    //   } else {
    //     // Second click - finish the line
    //     this.context.beginPath();
    //     this.context.moveTo(this.startPoint.x, this.startPoint.y);
    //     this.context.lineTo(x, y);
    //     this.context.strokeStyle = this.currentColor;
    //     this.context.stroke();
    //     this.startPoint = null;
    //     this.lastImageData = null;
    //   }
    // } else {
    //   // Freehand drawing
    //   this.isDrawing = true;
    //   this.draw(event)
    // }
  }
 
  draw(event: MouseEvent) {
    if (!this.isDrawing) 
      return;
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
  
    //if (this.drawingMode === 'freehand' && this.isDrawing) {
      this.context.lineTo(x, y);
      this.context.strokeStyle = this.currentColor;
      this.context.stroke();
      this.context.beginPath();
      this.context.moveTo(x, y);
    //} else if (this.drawingMode === 'line' && this.startPoint && this.lastImageData) {
    //   // Restore the previous canvas state
    //   this.context.putImageData(this.lastImageData, 0, 0);
      
    //   // Draw the preview line
    //   this.context.beginPath();
    //   this.context.moveTo(this.startPoint.x, this.startPoint.y);
    //   this.context.lineTo(x, y);
    //   this.context.strokeStyle = this.currentColor;
    //   this.context.stroke();
    // }
  }
  
  stopDrawing() {
    this.isDrawing = false;
    if (this.drawingMode === 'freehand') {
      this.context.beginPath();
    }
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
    this.startPoint = null;
    this.lastImageData = null;
  }
  
}
