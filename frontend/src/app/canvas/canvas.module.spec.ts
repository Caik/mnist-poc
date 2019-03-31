import { CanvasModule } from './canvas.module';

describe('CanvasModule', () => {
	let canvasModule: CanvasModule;

	beforeEach(() => {
		canvasModule = new CanvasModule();
	});

	it('should create an instance', () => {
		expect(canvasModule).toBeTruthy();
	});
});
