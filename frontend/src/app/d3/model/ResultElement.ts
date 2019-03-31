export default class ResultElement {
	private _value: number;

	private _choosen = false;

	constructor(value: number) {
		this._value = value;
	}

	public static of(value: number): ResultElement {
		return new ResultElement(value);
	}

	public static ofs(values: number[]): ResultElement[] {
		return values.map(i => ResultElement.of(i));
	}

	public formatPercentage(): string {
		if (this._value === 0) {
			return '0%';
		}

		return (this._value * 100).toPrecision(3).toString() + '%';
	}

	public get value(): number {
		return this._value;
	}

	public set value(value: number) {
		this._value = value;
	}

	public get choosen(): boolean {
		return this._choosen;
	}

	public set choosen(value: boolean) {
		this._choosen = value;
	}
}
