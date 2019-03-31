import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CanvasModule } from './canvas/canvas.module';
import { D3Module } from './d3/d3.module';
import { UiModule } from './ui/ui.module';

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, UiModule, D3Module, CanvasModule],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
