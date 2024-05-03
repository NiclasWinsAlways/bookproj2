import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookListComponentComponent } from './book-list-component.component';

describe('BookListComponentComponent', () => {
  let component: BookListComponentComponent;
  let fixture: ComponentFixture<BookListComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookListComponentComponent]
    });
    fixture = TestBed.createComponent(BookListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
