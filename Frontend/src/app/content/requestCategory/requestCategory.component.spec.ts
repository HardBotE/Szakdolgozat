import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCategoryComponent } from './requestCategory.component';

describe('CategoryComponent', () => {
  let component: RequestCategoryComponent;
  let fixture: ComponentFixture<RequestCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
