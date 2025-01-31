import { ComponentFixture, TestBed } from '@angular/core/testing';

import { audioComponent } from './audio.component';

describe('audioComponent', () => {
  let component: audioComponent;
  let fixture: ComponentFixture<audioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [audioComponent]
    });
    fixture = TestBed.createComponent(audioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
