import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { pairwise, switchMap, takeUntil } from 'rxjs/operators';
import { ResultElementService } from 'src/app/d3/service/result-element.service';

class Edges {
	private minX: number;
	private minY: number;
	private maxX: number;
	private maxY: number;
	private pad: number;
	private width: number;
	private height: number;

	constructor(pad: number, width: number, height: number) {
		this.pad = pad;
		this.width = width;
		this.height = height;

		this.clear();
	}

	public clear() {
		this.minX = undefined;
		this.minY = undefined;
		this.maxX = undefined;
		this.maxY = undefined;
	}

	public analyse(currentPos: { x: number; y: number }) {
		if (this.minX === undefined || this.minX > currentPos.x) {
			this.minX = Math.max(currentPos.x, this.pad);
		}

		if (this.maxX === undefined || this.maxX < currentPos.x) {
			this.maxX = Math.min(currentPos.x, this.width - this.pad);
		}

		if (this.minY === undefined || this.minY > currentPos.y) {
			this.minY = Math.max(currentPos.y, this.pad);
		}

		if (this.maxY === undefined || this.maxY < currentPos.y) {
			this.maxY = Math.min(currentPos.y, this.height - this.pad);
		}
	}

	public getX(): number {
		return this.minX;
	}

	public getY(): number {
		return this.minY;
	}

	public getWidth(): number {
		return this.maxX - this.minX;
	}

	public getHeight(): number {
		return this.maxY - this.minY;
	}
}

@Component({
	selector: 'app-white-board',
	templateUrl: './white-board.component.html',
	styleUrls: ['./white-board.component.css']
})
export class WhiteBoardComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('canvasFront')
	public canvasFront: ElementRef;

	@ViewChild('canvasBack')
	public canvasBack: ElementRef;

	@ViewChild('image')
	public image: ElementRef;

	@Input()
	public width = 300;

	@Input()
	public height = 300;

	public drawed = false;

	private pad = 40;

	private backCtx: CanvasRenderingContext2D;

	private frontCtx: CanvasRenderingContext2D;

	private subscription: Subscription;

	private edges: Edges;

	private finalWidth = 28;

	private finalHeigth = 28;

	constructor(private d3Service: ResultElementService, private renderer: Renderer2) {}

	ngOnInit(): void {
		this.edges = new Edges(this.pad, this.width, this.height);
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	public ngAfterViewInit(): void {
		this.initBackCanvas();
		this.initFrontCanvas();

		this.image.nativeElement.height = this.height;
		this.image.nativeElement.width = this.width;
	}

	private initBackCanvas() {
		const canvasBackEl: HTMLCanvasElement = this.canvasBack.nativeElement;
		this.backCtx = canvasBackEl.getContext('2d');

		canvasBackEl.width = this.width;
		canvasBackEl.height = this.height;

		this.backCtx.lineWidth = 20;
		this.backCtx.lineCap = 'round';
		this.backCtx.strokeStyle = '#000';
		this.backCtx.shadowBlur = 10;
		this.backCtx.shadowColor = 'rgb(0, 0, 0)';

		this.captureEvents(canvasBackEl);
	}

	private initFrontCanvas() {
		const canvasFrontEl: HTMLCanvasElement = this.canvasFront.nativeElement;
		this.frontCtx = canvasFrontEl.getContext('2d');

		canvasFrontEl.width = this.width;
		canvasFrontEl.height = this.height;

		this.frontCtx.lineWidth = 2;
		this.frontCtx.strokeStyle = 'red';
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

			const prevPos = {
				x: res[0].clientX - rect.left,
				y: res[0].clientY - rect.top
			};

			const currentPos = {
				x: res[1].clientX - rect.left,
				y: res[1].clientY - rect.top
			};

			this.drawOnCanvas(prevPos, currentPos);
			this.updateImage();
		});
	}

	private drawOnCanvas(prevPos: { x: number; y: number }, currentPos: { x: number; y: number }) {
		if (!this.backCtx) {
			return;
		}

		if (prevPos) {
			this.backCtx.beginPath();
			this.backCtx.moveTo(prevPos.x, prevPos.y);
			this.backCtx.lineTo(currentPos.x, currentPos.y);
			this.backCtx.stroke();
			this.backCtx.closePath();

			this.drawed = true;

			this.edges.analyse(currentPos);
			this.drawBoundRect();
		}
	}

	private updateImage(): void {
		const { x, y, width, heigth } = this.getBoundRect();

		try {
			const imgData = this.backCtx.getImageData(x, y, width, heigth);

			const centerCanvas = document.createElement('canvas');
			const centerCtx = centerCanvas.getContext('2d');
			centerCanvas.width = this.width;
			centerCanvas.height = this.height;
			centerCtx.putImageData(imgData, (this.width - imgData.width) / 2, (this.height - imgData.height) / 2);

			const resizeCanvas = document.createElement('canvas');
			const resizeCtx = resizeCanvas.getContext('2d');
			resizeCtx.drawImage(centerCanvas, 0, 0, this.finalWidth, this.finalHeigth);
			const resizedImg = resizeCtx.getImageData(0, 0, this.finalWidth, this.finalHeigth);

			const tmpCanvas = document.createElement('canvas');
			const tmpCtx = tmpCanvas.getContext('2d');
			tmpCanvas.width = this.finalWidth;
			tmpCanvas.height = this.finalHeigth;
			tmpCtx.putImageData(resizedImg, 0, 0);

			this.image.nativeElement.src = tmpCanvas.toDataURL();
		} catch {
			this.image.nativeElement.src = this.backCtx.canvas.toDataURL();
		}
	}

	public clearCanvas(): void {
		this.backCtx.clearRect(0, 0, this.width, this.height);
		this.frontCtx.clearRect(0, 0, this.width, this.height);
		this.edges.clear();

		this.updateImage();

		this.drawed = false;
	}

	public sendData() {
		this.drawed = false;

		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		const img = this.image.nativeElement;

		canvas.width = this.finalWidth;
		canvas.height = this.finalHeigth;
		context.drawImage(img, 0, 0);

		const data = this.treatData(context.getImageData(0, 0, this.finalWidth, this.finalHeigth));

		// this.d3Service.fetchElements();
	}

	private drawBoundRect() {
		this.frontCtx.clearRect(0, 0, this.width, this.height);
		this.frontCtx.beginPath();

		const { x, y, width, heigth } = this.getBoundRect();

		this.frontCtx.rect(x, y, width, heigth);
		this.frontCtx.stroke();
	}

	private getBoundRect() {
		const pad = 20;

		const x = this.edges.getX() - pad;
		const y = this.edges.getY() - pad;
		const width = this.edges.getWidth() + pad * 2;
		const heigth = this.edges.getHeight() + pad * 2;

		return { x, y, width, heigth };
	}

	private treatData(imgData: ImageData): number[] {
		const ret: number[] = [];

		for (let i = 0; i < imgData.data.length; i += 4) {
			ret.push(imgData.data[i + 3]);
		}

		return ret;
	}
}
