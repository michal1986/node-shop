import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConfirmedDialogComponent } from './order-confirmed-dialog.component';

describe('OrderConfirmedDialogComponent', () => {
  let component: OrderConfirmedDialogComponent;
  let fixture: ComponentFixture<OrderConfirmedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderConfirmedDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderConfirmedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
