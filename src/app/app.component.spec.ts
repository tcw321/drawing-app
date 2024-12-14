import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DrawingComponent } from './drawing/drawing.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, DrawingComponent],
      providers: [provideAnimations()]
    }).compileComponents();
    
    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have the correct title', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    const titleElement = fixture.nativeElement.querySelector('h1');
    expect(titleElement?.textContent?.trim()).toBe('Angular Drawing App');
  }));

  it('should render drawing component', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    const drawingElement = fixture.nativeElement.querySelector('app-drawing');
    expect(drawingElement).toBeTruthy();
  }));
});
