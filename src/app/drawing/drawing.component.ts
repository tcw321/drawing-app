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
    console.log('Start drawing');
    this.isDrawing = true;
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    this.startPoint.x = event.clientX - rect.left;
    this.startPoint.y = event.clientY - rect.top;
    if (this.drawingMode === 'freehand') {
      this.context.beginPath();
      this.context.moveTo(this.startPoint.x, this.startPoint.y);
    }
    else if (this.drawingMode === 'line') {
      this.lastImageData = this.context.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height); // savedCanvas = this.context.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }
  }
 
  draw(event: MouseEvent) {
    if (!this.isDrawing) {
      console.log('not drawing');
      return;
    }
    console.log('drawing');

    const rect = this.canvas.nativeElement.getBoundingClientRect();
    if (this.drawingMode === 'line')
      {
        this.context.putImageData(this.lastImageData!, 0, 0);
        this.context.beginPath();
        this.context.moveTo(this.startPoint.x, this.startPoint.y);
        this.context.lineTo(event.clientX - rect.left, event.clientY - rect.top);
        this.context.strokeStyle = this.currentColor;
        this.context.stroke();
      }
    else {

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        this.context.strokeStyle = this.currentColor;
      
        this.context.lineTo(x, y);
        this.context.stroke();}
  }
  
  stopDrawing(event: MouseEvent) {
    this.isDrawing = false;
    console.log('Stop drawing');

    if (this.drawingMode === 'line' && this.startPoint) {
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const endX = event.clientX - rect.left;
      const endY = event.clientY - rect.top;
      this.context.putImageData(this.lastImageData!, 0, 0);
      this.context.beginPath();
      this.context.moveTo(this.startPoint.x, this.startPoint.y);
      this.context.lineTo(endX, endY);
      this.context.strokeStyle = this.currentColor;
      this.context.stroke();
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
    this.startPoint = { x: 0, y: 0 };
    this.lastImageData = null;
  }
  
}
