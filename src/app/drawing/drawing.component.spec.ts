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
      imports: [FormsModule],
      declarations: []
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

  it('should initialize with default color', () => {
    expect(component.currentColor).toBe('#000000');
  });

  it('should initialize canvas context on ngOnInit', () => {
    component.ngOnInit();
    expect(component['context']).toBeTruthy();
    expect(component['context'].lineWidth).toBe(2);
    expect(component['context'].lineCap).toBe('round');
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
    component.stopDrawing();
    expect(component.isDrawing).toBeFalse();
  });

  it('should update color when color input changes', () => {
    const newColor = '#ff0000';
    const mockEvent = { target: { value: newColor } } as unknown as Event;
    
    component.updateColor(mockEvent);
    expect(component.currentColor).toBe(newColor);
  });

  it('should clear canvas when clearCanvas is called', () => {
    // Setup spy on clearRect
    const clearRectSpy = spyOn(context, 'clearRect');
    
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
    
    // Setup spy on stroke
    const strokeSpy = spyOn(context, 'stroke');
    
    component.isDrawing = false;
    component.draw(mockEvent);
    
    expect(strokeSpy).not.toHaveBeenCalled();
  });

  it('should draw when isDrawing is true', () => {
    const mockEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100
    });
    
    // Setup spies
    const strokeSpy = spyOn(context, 'stroke');
    const beginPathSpy = spyOn(context, 'beginPath');
    const moveToSpy = spyOn(context, 'moveTo');
    const lineToSpy = spyOn(context, 'lineTo');
    
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

    component.isDrawing = true;
    component.draw(mockEvent);
    
    expect(strokeSpy).toHaveBeenCalled();
    expect(beginPathSpy).toHaveBeenCalled();
    expect(moveToSpy).toHaveBeenCalled();
    expect(lineToSpy).toHaveBeenCalled();
  });

  it('should handle mouseout event', () => {
    component.isDrawing = true;
    component.stopDrawing();
    expect(component.isDrawing).toBeFalse();
  });
});
