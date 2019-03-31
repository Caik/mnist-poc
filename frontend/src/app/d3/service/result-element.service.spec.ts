import { TestBed } from '@angular/core/testing';

import { ResultElementService } from './result-element.service';

describe('ResultElementService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: ResultElementService = TestBed.get(ResultElementService);
		expect(service).toBeTruthy();
	});
});
