import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3DigitsComponent } from './d3-digits.component';

describe('D3DigitsComponent', () => {
	let component: D3DigitsComponent;
	let fixture: ComponentFixture<D3DigitsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [D3DigitsComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(D3DigitsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
