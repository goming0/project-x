import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, DebugElement, EventEmitter } from '@angular/core';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let debugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserModule, FormsModule],
      declarations: [SearchComponent],
    }).compileComponents();

    fixture = TestBed.overrideComponent(SearchComponent, {
      set: {
        templateUrl: './search.component.html',
        changeDetection: ChangeDetectionStrategy.Default,
      },
    }).createComponent(SearchComponent);

    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.detectChanges();
  });

  function doEvent() {
    jest.spyOn(component.searchChange, 'emit');
    const input: HTMLInputElement = debugEl.query(By.css('input')).nativeElement;
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delay be a number', () => {
    expect(typeof component.delay).toBe('number');
  });

  it('should searchValue = null', () => {
    expect(component.searchValue).toBeNull();
  });

  it('should onSearch be a Function', () => {
    expect(component.onSearch).toBeInstanceOf(Function);
  });

  it('should searchChange be a EventEmitter', () => {
    expect(component.searchChange).toBeInstanceOf(EventEmitter);
  });

  it('after input should typeOf searchValue === string', () => {
    const input: HTMLInputElement = debugEl.query(By.css('input')).nativeElement;
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(typeof component.searchValue).toBe('string');
  });

  it('should emit on change', () => {
    doEvent();
    setTimeout(() => {
      expect(component.searchChange.emit).toHaveBeenCalled();
      expect(component.searchChange.emit).toHaveBeenCalledWith('test');
    }, component.delay);
  });

  it('should after emit timeoutId toBeTruthy && number', () => {
    doEvent();
    setTimeout(() => {
      expect(component.timeoutId).toBeTruthy();
      expect(typeof component.timeoutId).toBe('number');
    }, component.delay);
  });
});
