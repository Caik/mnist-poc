import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { WhiteBoardComponent } from './white-board/white-board.component';

@NgModule({
	imports: [CommonModule],
	declarations: [WhiteBoardComponent],
	exports: [WhiteBoardComponent]
})
export class CanvasModule {}
