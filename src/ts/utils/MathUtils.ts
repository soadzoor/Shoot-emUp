export class MathUtils
{
	public static clamp(x: number, min: number, max: number): number
	{
		return x < min ? min : (x > max ? max : x);
	}

	// https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
	public static randomFromInterval(min: number, max: number)
	{ // min and max included
		return Math.random() * (max - min) + min;
	}
}