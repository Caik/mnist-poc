import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Subscription } from 'rxjs';

import ResultElement from '../model/ResultElement';
import { ResultElementService } from '../service/result-element.service';

@Component({
	selector: 'app-d3-digits',
	templateUrl: './d3-digits.component.html',
	styleUrls: ['./d3-digits.component.css']
})
export class D3DigitsComponent implements OnInit {
	private readonly svgWidth = 180;
	private readonly svgHeight = 200;
	private readonly circleRadius = 60;
	private readonly titleFontSize = 40;
	private readonly numberFontSize = 30;
	private readonly defaultFillOpacity = '0.1';

	subscription: Subscription;

	constructor(private reService: ResultElementService) {}

	ngOnInit() {
		this.initializeElements();
		this.subscription = this.reService.fetchElements().subscribe(result => this.updateElements(result));
	}

	private initializeElements() {
		const svgs = d3
			.select('#svgs')
			.selectAll('.svg')
			.data(d3.range(10))
			.enter()
			.append('div')
			.classed('svg', true)
			.append('svg')
			.attr('width', this.svgWidth)
			.attr('height', this.svgHeight);

		svgs.append('text')
			.attr('fill', '#000')
			.attr('x', 0)
			.attr('y', 0)
			.attr('font-size', this.titleFontSize)
			.attr('alignment-baseline', 'before-edge')
			.text((d, i) => 'Dígito ' + i);

		const innerGs = svgs.append('g').attr('transform', 'translate(6,50)');

		innerGs
			.append('circle')
			.attr('cx', this.circleRadius + 2)
			.attr('cy', this.circleRadius + 2)
			.attr('r', this.circleRadius)
			.attr('fill', '#009400')
			.attr('stroke', '#003300')
			.attr('stroke-width', 2)
			.classed('circle-value', true)
			.attr('fill-opacity', '0.6');

		innerGs
			.append('text')
			.attr('fill', '#000')
			.attr('x', this.circleRadius + 2)
			.attr('y', this.circleRadius + 2)
			.attr('font-size', this.numberFontSize)
			.attr('text-anchor', 'middle')
			.attr('alignment-baseline', 'central')
			.classed('text-value', true)
			.text('-');

		innerGs
			.append('text')
			.attr('fill', '#FFF')
			.attr('x', this.circleRadius + 1)
			.attr('y', this.circleRadius + 1)
			.attr('font-size', this.numberFontSize)
			.attr('text-anchor', 'middle')
			.attr('alignment-baseline', 'central')
			.classed('text-value-shadow', true);
	}

	private cleanElements() {
		d3.selectAll('.text-value').text('');
		d3.selectAll('.text-value-shadow').text('');
		d3.selectAll('.circle-value')
			.attr('fill-opacity', this.defaultFillOpacity)
			.attr('stroke-width', 2)
			.attr('r', this.circleRadius);
	}

	private updateElements(results: ResultElement[]) {
		this.cleanElements();

		d3.selectAll('.text-value')
			.data(results)
			.text(e => e.formatPercentage());

		d3.selectAll('.text-value-shadow')
			.data(results)
			.text(e => e.formatPercentage());

		d3.selectAll('.circle-value')
			.data(results)
			.attr('fill-opacity', e => e.value)
			.classed('choosen', e => e.choosen);

		d3.select('.choosen')
			.transition()
			.duration(800)
			.attr('stroke-width', 4)
			.attr('r', this.circleRadius + 6)
			.transition()
			.duration(800)
			.attr('stroke-width', 2)
			.attr('r', this.circleRadius)
			.transition()
			.duration(800)
			.attr('stroke-width', 4)
			.attr('r', this.circleRadius + 6);
	}
}
