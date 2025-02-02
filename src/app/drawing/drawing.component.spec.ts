import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DrawingComponent } from './drawing.component';

describe('DrawingComponent', () => {
  let component: DrawingComponent;
  let fixture: ComponentFixture<DrawingComponent>;
  let canvasElement: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        DrawingComponent // Import instead of declare since it's standalone
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DrawingComponent);
    component = fixture.componentInstance;
    
    // Mock canvas and context
    canvasElement = document.createElement('canvas');
    context = canvasElement.getContext('2d')!;
    component.canvas = { nativeElement: canvasElement };
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default line width', () => {
    expect(component.lineWidth).toBe(2);
  });

  it('should initialize canvas context with default line width', () => {
    component.ngAfterViewInit();
    expect(component['context'].lineWidth).toBe(2);
  });

  it('should update line width when range input changes', () => {
    const newWidth = 10;
    const mockEvent = { 
      target: { value: newWidth.toString() } 
    } as unknown as Event;
    
    component.updateLineWidth(mockEvent);
    
    expect(component.lineWidth).toBe(newWidth);
    expect(component['context'].lineWidth).toBe(newWidth);
  });

  it('should handle minimum line width', () => {
    const minWidth = 1;
    const mockEvent = { 
      target: { value: minWidth.toString() } 
    } as unknown as Event;
    
    component.updateLineWidth(mockEvent);
    
    expect(component.lineWidth).toBe(minWidth);
    expect(component['context'].lineWidth).toBe(minWidth);
  });

  it('should handle maximum line width', () => {
    const maxWidth = 20;
    const mockEvent = { 
      target: { value: maxWidth.toString() } 
    } as unknown as Event;
    
    component.updateLineWidth(mockEvent);
    
    expect(component.lineWidth).toBe(maxWidth);
    expect(component['context'].lineWidth).toBe(maxWidth);
  });

  it('should maintain line width after clearing canvas', () => {
    const newWidth = 15;
    const mockEvent = { 
      target: { value: newWidth.toString() } 
    } as unknown as Event;
    
    component.updateLineWidth(mockEvent);
    component.clearCanvas();
    
    expect(component['context'].lineWidth).toBe(newWidth);
  });

  it('should initialize with default color', () => {
    expect(component.currentColor).toBe('#000000');
  });

  it('should start drawing on mousedown', () => {
    const mockEvent = new MouseEvent('mousedown', {
      clientX: 100,
      clientY: 100
    });
    
    component.startDrawing(mockEvent);
    expect(component.isDrawing).toBeTrue();
  });

  it('should stop drawing on mouseup', () => {
    component.isDrawing = true;
    const mockEvent = new MouseEvent('mouseup', {
      clientX: 110,
      clientY: 110
    });
    component.stopDrawing(mockEvent);
    expect(component.isDrawing).toBeFalse();
  });

  it('should handle mouseout event', () => {
    component.isDrawing = true;
    const mockEvent = new MouseEvent('mouseout');
    component.stopDrawing(mockEvent);
    expect(component.isDrawing).toBeFalse();
  });

  it('should update color when color input changes', () => {
    const newColor = '#ff0000';
    const mockEvent = { target: { value: newColor } } as unknown as Event;
    
    component.updateColor(mockEvent);
    expect(component.currentColor).toBe(newColor);
  });

  it('should clear canvas when clearCanvas is called', () => {
    const clearRectSpy = spyOn((component as any)['context'], 'clearRect');
    
    component.clearCanvas();
    
    expect(clearRectSpy).toHaveBeenCalledWith(
      0, 
      0, 
      component.canvas.nativeElement.width, 
      component.canvas.nativeElement.height
    );
  });

  it('should not draw when isDrawing is false', () => {
    const mockEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100
    });
    
    const strokeSpy = spyOn((component as any)['context'], 'stroke');
    
    component.isDrawing = false;
    component.draw(mockEvent);
    
    expect(strokeSpy).not.toHaveBeenCalled();
  });

  it('should draw with current line width when drawing', () => {
    const mockEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100
    });
    
    const newWidth = 8;
    component.lineWidth = newWidth;
    component['context'].lineWidth = newWidth;
    
    // Setup spies
    const strokeSpy = spyOn((component as any)['context'], 'stroke');
  
    spyOn(canvasElement, 'getBoundingClientRect').and.returnValue({
      left: 0,
      top: 0,
      width: 800,
      height: 600,
      right: 800,
      bottom: 600,
      x: 0,
      y: 0,
      toJSON: () => {}
    });

    component.isDrawing = true;
    component.draw(mockEvent);
    
    expect(component['context'].lineWidth).toBe(newWidth);
    expect(strokeSpy).toHaveBeenCalled();
 
  });

  it('should draw when isDrawing is true', () => {
    const mockEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100
    });
    
    // Initialize the component's context first
    component.ngAfterViewInit();
    
    // Setup spies on the component's context
    const beginPathSpy = spyOn((component as any)['context'], 'beginPath');
    const moveToSpy = spyOn((component as any)['context'], 'moveTo');
    
    // Mock getBoundingClientRect
    spyOn(canvasElement, 'getBoundingClientRect').and.returnValue({
      left: 0,
      top: 0,
      width: 800,
      height: 600,
      right: 800,
      bottom: 600,
      x: 0,
      y: 0,
      toJSON: () => {}
    });
    
    // Start drawing
    component.startDrawing(mockEvent);
    
    expect(beginPathSpy).toHaveBeenCalled();
    expect(moveToSpy).toHaveBeenCalled();
  });
  it('should draw line when isDrawing is true in line mode', () => {
    const mockEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100
    });
    
    // Initialize the component's context first
    component.ngAfterViewInit();
    component.drawingMode = 'line';

    // Setup spies on the component's context
    const getImageDataSpy = spyOn((component as any)['context'], 'getImageData');
    
    // Mock getBoundingClientRect
    spyOn(canvasElement, 'getBoundingClientRect').and.returnValue({
      left: 0,
      top: 0,
      width: 800,
      height: 600,
      right: 800,
      bottom: 600,
      x: 0,
      y: 0,
      toJSON: () => {}
    });
    
    // Start drawing
    component.startDrawing(mockEvent);
    
    expect(getImageDataSpy).toHaveBeenCalled();
  
    const putImageDataSpy = spyOn((component as any)['context'], 'putImageData');
    const beginPathSpy = spyOn((component as any)['context'], 'beginPath');
    const moveToSpy = spyOn((component as any)['context'], 'moveTo');
    const lineToSpy = spyOn((component as any)['context'], 'lineTo');
    component.draw(mockEvent);
  
    expect(putImageDataSpy).toHaveBeenCalled();
    expect(beginPathSpy).toHaveBeenCalled();
    expect(moveToSpy).toHaveBeenCalled();
    expect(lineToSpy).toHaveBeenCalled();

    putImageDataSpy.calls.reset();
    beginPathSpy.calls.reset();
    moveToSpy.calls.reset();
    lineToSpy.calls.reset();
    component.stopDrawing(mockEvent);
    expect(putImageDataSpy).toHaveBeenCalled();
    expect(beginPathSpy).toHaveBeenCalled();
    expect(moveToSpy).toHaveBeenCalled();
    expect(lineToSpy).toHaveBeenCalled();


  });

});
