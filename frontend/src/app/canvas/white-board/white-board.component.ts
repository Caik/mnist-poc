import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { pairwise, switchMap, takeUntil } from 'rxjs/operators';
import { ResultElementService } from 'src/app/d3/service/result-element.service';

@Component({
	selector: 'app-white-board',
	templateUrl: './white-board.component.html',
	styleUrls: ['./white-board.component.css']
})
export class WhiteBoardComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('canvas')
	public canvas: ElementRef;

	@Input()
	public width = 400;

	@Input()
	public height = 400;

	private cx: CanvasRenderingContext2D;

	private subscription: Subscription;

	public drawed = false;

	constructor(private d3Service: ResultElementService) {}

	ngOnInit(): void {}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	public ngAfterViewInit(): void {
		const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
		this.cx = canvasEl.getContext('2d');

		canvasEl.width = this.width;
		canvasEl.height = this.height;

		this.cx.lineWidth = 20;
		this.cx.lineCap = 'round';
		this.cx.strokeStyle = '#000';

		this.captureEvents(canvasEl);
	}

	private captureEvents(canvasEl: HTMLCanvasElement) {
		const obs = fromEvent(canvasEl, 'mousedown').pipe(
			switchMap(e =>
				fromEvent(canvasEl, 'mousemove')
					.pipe(takeUntil(fromEvent(canvasEl, 'mouseup')))
					.pipe(takeUntil(fromEvent(canvasEl, 'mouseleave')))
					.pipe(pairwise())
			)
		);

		this.subscription = obs.subscribe((res: [MouseEvent, MouseEvent]) => {
			const rect = canvasEl.getBoundingClientRect();

			// TODO avaliar esse cara para entender melhor os dados

			const prevPos = {
				x: res[0].clientX - rect.left,
				y: res[0].clientY - rect.top
			};

			const currentPos = {
				x: res[1].clientX - rect.left,
				y: res[1].clientY - rect.top
			};

			this.drawOnCanvas(prevPos, currentPos);
		});
	}

	private drawOnCanvas(prevPos: { x: number; y: number }, currentPos: { x: number; y: number }) {
		if (!this.cx) {
			return;
		}

		this.cx.beginPath();

		if (prevPos) {
			this.cx.moveTo(prevPos.x, prevPos.y);
			this.cx.lineTo(currentPos.x, currentPos.y);
			this.cx.stroke();

			this.drawed = true;
		}
	}

	public clearCanvas(): void {
		this.cx.clearRect(0, 0, this.width, this.height);
		this.drawed = false;
	}

	public sendData() {
		this.drawed = false;
		// this.d3Service.fetchElements();
	}
}
