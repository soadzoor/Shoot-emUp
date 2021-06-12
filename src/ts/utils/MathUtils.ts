export interface IVec2
{
	x: number;
	y: number;
}

interface IRect {
	position: IVec2;
	width: number;
	height: number;
}

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

	// https://gamedev.stackexchange.com/questions/586/what-is-the-fastest-way-to-work-out-2d-bounding-box-intersection
	public static detectAABBCollision(rect1: IRect, rect2: IRect)
	{
		return (Math.abs(rect1.position.x - rect2.position.x) * 2 < (rect1.width + rect2.width)) &&
		       (Math.abs(rect1.position.y - rect2.position.y) * 2 < (rect1.height + rect2.height));
	}
}