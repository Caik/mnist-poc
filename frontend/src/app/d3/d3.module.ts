import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { D3DigitsComponent } from './d3-digits/d3-digits.component';

@NgModule({
	imports: [CommonModule],
	declarations: [D3DigitsComponent],
	exports: [D3DigitsComponent]
})
export class D3Module {}
