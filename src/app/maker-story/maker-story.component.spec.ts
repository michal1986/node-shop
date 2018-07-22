import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakerStoryComponent } from './maker-story.component';

describe('MakerStoryComponent', () => {
  let component: MakerStoryComponent;
  let fixture: ComponentFixture<MakerStoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakerStoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakerStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
