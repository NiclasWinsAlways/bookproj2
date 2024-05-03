import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookComponentComponent } from './add-book-component.component';

describe('AddBookComponentComponent', () => {
  let component: AddBookComponentComponent;
  let fixture: ComponentFixture<AddBookComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBookComponentComponent]
    });
    fixture = TestBed.createComponent(AddBookComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
