import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateNewPasswordMobilePage } from './create-new-password-mobile.page';

describe('CreateNewPasswordMobilePage', () => {
  let component: CreateNewPasswordMobilePage;
  let fixture: ComponentFixture<CreateNewPasswordMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewPasswordMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
