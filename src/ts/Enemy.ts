import {IDestroyOptions, Sprite} from "pixi.js";
import {MathUtils} from "utils/MathUtils";

export class Enemy
{
	private _sprite: Sprite;
	private _velocity: {x: number, y: number} = {
		x: 0,
		y: 0
	};

	private _timeoutId: number = 0;

	constructor(sprite: Sprite)
	{
		this._sprite = sprite;
		this._sprite.anchor.set(0.5, 0.5);

		this.updateVelocityWithRandom();
	}

	private updateVelocityWithRandom = () =>
	{
		this._timeoutId = window.setTimeout(this.updateVelocityWithRandom, MathUtils.randomFromInterval(200, 1000));
		const maxSpeed = 0.3;
		this._velocity.x = MathUtils.randomFromInterval(-maxSpeed, maxSpeed);
		this._velocity.y = MathUtils.randomFromInterval(-maxSpeed, maxSpeed);
	}

	public updatePosition(delta: number, canvasWidth: number, canvasHeight: number)
	{
		const dx = this._velocity.x * delta;
		this.position.x += dx;

		if (
			this.position.x - this.width / 2 < 0 && this._velocity.x < 0 ||
			this.position.x + this.width / 2 > canvasWidth && this._velocity.x > 0
		)
		{
			this._velocity.x *= -1;
		}

		const dy = this._velocity.y * delta;
		this.position.y += dy;

		if (
			this.position.y - this.height / 2 < 0 && this._velocity.y < 0 ||
			this.position.y + this.height / 2 > canvasHeight && this._velocity.y > 0
		)
		{
			this._velocity.y *= -1;
		}
	}

	public get sprite()
	{
		return this._sprite;
	}

	public get position()
	{
		return this._sprite.position;
	}

	public get width()
	{
		return this._sprite.width;
	}

	public get height()
	{
		return this._sprite.height;
	}

	public destroy(options?: IDestroyOptions | boolean)
	{
		clearTimeout(this._timeoutId);
		this._sprite.destroy(options);
	}

	public static async create()
	{
		
	}
}