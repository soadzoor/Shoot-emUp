import {Application} from "@pixi/app";
import {Graphics, Sprite, TilingSprite} from "pixi.js";
import {TextureManager} from "TextureManager";
import {BrowserWindow} from "utils/BrowserWindow";
import {MathUtils} from "utils/MathUtils";

export class GameEngine
{
	private _containerDiv = document.getElementById("playGround");
	private _textureManager: TextureManager = new TextureManager();
	private _app: Application = new Application();
	private _background: {
		far: {
			sprite: TilingSprite;
			speed: number;
		},
		mid: {
			sprite: TilingSprite;
			speed: number;
		}
	};

	private _player: Sprite;

	private _bullets: Graphics[] = [];
	private _bulletSpeed: number = 0.8; // px / ms

	private _prevTimeStamp: number = 0;
	private _currentTimeStamp: number = 1;
	private _delta: number = 1;
	private _shootIntervalId: number;
	private _enemyIntervalId: number;
	private _tickId: number;

	public async init()
	{
		if (this._containerDiv)
		{
			const canvas = this._canvas;
			this._containerDiv.appendChild(canvas);

			this._background = {
				far: {
					sprite: await this._textureManager.loadSprite("assets/images/bg-far.png", true) as TilingSprite,
					speed: 0.015
				},
				mid: {
					sprite: await this._textureManager.loadSprite("assets/images/bg-mid.png", true) as TilingSprite,
					speed: 0.03
				}
			};

			this._background.far.sprite.scale.y = canvas.height / this._background.far.sprite.texture.height;
			this._background.far.sprite.scale.x = this._background.far.sprite.scale.y;

			this._background.mid.sprite.scale.y = canvas.height / this._background.mid.sprite.texture.height;
			this._background.mid.sprite.scale.x = this._background.mid.sprite.scale.y;

			this._app.stage.addChild(this._background.far.sprite);
			this._app.stage.addChild(this._background.mid.sprite);

			this._player = await this._textureManager.loadSprite("assets/images/spaceship.png");
			this._player.anchor.set(0.5, 0.5);

			this._app.stage.addChild(this._player);

			window.addEventListener("mousemove", this.onMouseMove);
			window.addEventListener("touchmove", this.onTouchMove);

			this._shootIntervalId = window.setInterval(() =>
			{
				const bullet = new Graphics();
				bullet.beginFill(0x00FF00);
				const width = 30;
				const height = 5;
				bullet.drawRect(0, 0, width, height);
				bullet.pivot.set(width / 2, height / 2);
				bullet.position.set(this._player.position.x, this._player.position.y);

				this._bullets.push(bullet);
				this._app.stage.addChild(bullet);
			}, 500);


			this._tickId = window.requestAnimationFrame(this.onTick);
		}
		else
		{
			console.warn("Container div doesn't exist");
		}
	}

	private get _canvas()
	{
		return this._app.view;
	}

	private onMouseMove = (event: MouseEvent) =>
	{
		this.onPointerMove(event.clientX, event.clientY);
	};

	private onTouchMove = (event: TouchEvent) =>
	{
		if (event.touches.length === 1)
		{
			this.onPointerMove(event.touches[0].clientX, event.touches[0].clientY);
		}
	};

	private onPointerMove(clientX: number, clientY: number)
	{
		let {localX, localY} = BrowserWindow.clientXYToLocalXY(clientX, clientY, this._canvas);
		localX = MathUtils.clamp(localX, 0, this._canvas.width);
		localY = MathUtils.clamp(localY, 0, this._canvas.height);
		this._player.position.set(localX, localY);
	}

	private updateBackground(delta: number)
	{
		this._background.far.sprite.tilePosition.x -= this._background.far.speed * delta;
		this._background.mid.sprite.tilePosition.x -= this._background.mid.speed * delta;
	}

	private updateBullets(delta: number)
	{
		const activeBullets: Graphics[] = [];
		for (const bullet of this._bullets)
		{
			bullet.position.x += this._bulletSpeed * delta;
			if (bullet.position.x - bullet.width / 2 < this._canvas.width)
			{
				activeBullets.push(bullet);
			}
			else
			{
				bullet.destroy();
			}
		}

		this._bullets = activeBullets;
	}

	private onTick = () =>
	{
		this._currentTimeStamp = performance.now();
		this._delta = this._currentTimeStamp - this._prevTimeStamp;
		this._tickId = window.requestAnimationFrame(this.onTick);

		this.updateBackground(this._delta);
		this.updateBullets(this._delta);

		this._prevTimeStamp = this._currentTimeStamp;
		//this._spaceShip.position.y = 200 + 50 * Math.sin(performance.now() / 1000);
	};
}