import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import ResultElement from '../model/ResultElement';

@Injectable({
	providedIn: 'root'
})
export class ResultElementService {
	public fetchElements(): Observable<ResultElement[]> {
		return new Observable<ResultElement[]>(observer => () => observer.next(this.generate()));
	}

	public generate(): ResultElement[] {
		const ret: ResultElement[] = [];

		for (let i = 0; i < 10; i++) {
			ret.push(ResultElement.of(Math.random()));
		}

		const min = ret.reduce((max, e) => (e.value > max ? e.value : max), 0);
		ret.find(e => e.value === min).choosen = true;

		return ret;
	}
}
