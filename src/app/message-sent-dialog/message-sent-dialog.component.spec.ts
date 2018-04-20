import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSentDialogComponent } from './message-sent-dialog.component';

describe('MessageSentDialogComponent', () => {
  let component: MessageSentDialogComponent;
  let fixture: ComponentFixture<MessageSentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageSentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
