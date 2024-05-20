import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageloansComponent } from './manageloans.component';

describe('ManageloansComponent', () => {
  let component: ManageloansComponent;
  let fixture: ComponentFixture<ManageloansComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageloansComponent]
    });
    fixture = TestBed.createComponent(ManageloansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
