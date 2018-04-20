import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPaymentMethodComponent } from './order-payment-method.component';

describe('OrderPaymentMethodComponent', () => {
  let component: OrderPaymentMethodComponent;
  let fixture: ComponentFixture<OrderPaymentMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPaymentMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
