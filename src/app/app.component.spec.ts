import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`pressNum`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.pressNum('7')
    expect(app.input).toContain('7');
    app.pressNum('.')
    expect(app.input).toContain('.');    
    app.input = ''
    expect(app.input).toEqual('');
  });

  it(`getLastOperand`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.input = '3/15';
    expect(app.getLastOperand()).toEqual('15');
  });

  it(`pressOperator`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.pressOperator('47-17')
    expect(app.input).toContain('-');
    app.pressOperator('47+17')
    expect(app.input).toContain('+');
  });

  it(`clear`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.clear()
    expect(app.input).toEqual('');
  });

  it(`allClear `, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.result = '3';
    app.allClear();
    expect(app.result).toEqual('');
  });

  it(`calcAnswer`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.input = '11+2';
    app.calcAnswer();
    expect(app.result.toString()).toEqual('13');
    app.input = '2.5+2.';
    app.calcAnswer();
    expect(app.result.toString()).toEqual('4.5');
    app.input = '1+1-';
    app.calcAnswer();
    expect(app.result.toString()).toEqual('2');
  });

  it(`getAnswer`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.input = '15*10';
    app.getAnswer()
    expect(app.input).toEqual(app.result);
    app.input = '0';
    app.getAnswer()
    expect(app.input).toEqual('');
  });

});
