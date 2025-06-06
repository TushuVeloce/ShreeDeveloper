import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileMobilePage } from './user-profile-mobile.page';

describe('UserProfileMobilePage', () => {
  let component: UserProfileMobilePage;
  let fixture: ComponentFixture<UserProfileMobilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
