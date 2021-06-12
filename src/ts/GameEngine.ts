import {Application} from "@pixi/app";
import {Sprite} from "pixi.js";
import {TextureManager} from "TextureManager";
import {BrowserWindow} from "utils/BrowserWindow";
import {MathUtils} from "utils/MathUtils";

export class GameEngine
{
	private _containerDiv = document.getElementById("playGround");
	private _textureManager: TextureManager = new TextureManager();
	private _app: Application = new Application();
	private _spaceShip: Sprite;

	public async init()
	{
		if (this._containerDiv)
		{
			const canvas = this._canvas;
			this._containerDiv.appendChild(canvas);

			this._spaceShip = await this._textureManager.loadSprite("assets/images/spaceship.png");
			this._spaceShip.anchor.set(0.5, 0.5);
			//this._spaceShip.position.x = 200;
			//this._spaceShip.position.y = 200;

			this._app.stage.addChild(this._spaceShip);

			window.addEventListener("mousemove", this.onMouseMove);
			window.addEventListener("touchmove", this.onTouchMove);

			this._app.ticker.add(this.onTick);
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
		this._spaceShip.position.set(localX, localY);
	}

	private onTick = (delta: number) =>
	{
		//this._spaceShip.position.y = 200 + 50 * Math.sin(performance.now() / 1000);
	};
}