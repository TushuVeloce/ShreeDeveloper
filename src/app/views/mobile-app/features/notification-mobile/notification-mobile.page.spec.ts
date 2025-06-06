import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationMobilePage } from './notification-mobile.page';

describe('NotificationMobilePage', () => {
  let component: NotificationMobilePage;
  let fixture: ComponentFixture<NotificationMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
