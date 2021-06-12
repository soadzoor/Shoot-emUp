import {Application} from "@pixi/app";
import {ExplosionManager} from "ExplosionManager";
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
	private _enemies: Sprite[] = [];

	private _projectiles: Graphics[] = [];
	private _projectileSpeed: number = 0.8; // px / ms

	private _explosionManager: ExplosionManager;

	private _prevTimeStamp: number = 0;
	private _currentTimeStamp: number = 1;
	private _delta: number = 1;
	private _shootIntervalId: number;
	private _enemySpawnIntervalId: number;
	private _tickId: number;

	public async init()
	{
		if (this._containerDiv)
		{
			const canvas = this._canvas;
			this._containerDiv.appendChild(canvas);

			await this.initBackground();

			this._player = await this._textureManager.loadSprite("assets/images/spaceship.svg");
			this._player.anchor.set(0.5, 0.5);

			this._app.stage.addChild(this._player);

			window.addEventListener("mousemove", this.onMouseMove);
			window.addEventListener("touchmove", this.onTouchMove);

			this._explosionManager = new ExplosionManager(await this._textureManager.loadTexture("assets/images/particle.png"));
			this._app.stage.addChild(this._explosionManager.container);

			this._shootIntervalId = window.setInterval(() =>
			{
				const projectile = new Graphics();
				projectile.beginFill(0x00FF00);
				const width = 30;
				const height = 5;
				projectile.drawRect(0, 0, width, height);
				projectile.pivot.set(width / 2, height / 2);
				projectile.position.set(this._player.position.x, this._player.position.y);

				this._projectiles.push(projectile);
				this._app.stage.addChild(projectile);
			}, 500);

			this._enemySpawnIntervalId = window.setInterval(async () =>
			{
				const enemy = await this._textureManager.loadSprite("assets/images/enemy.png");
				enemy.anchor.set(0.5, 0.5);

				enemy.position.x = this._canvas.width + enemy.width / 2;
				enemy.position.y = Math.random() * this._canvas.height;

				this._enemies.push(enemy);
				this._app.stage.addChild(enemy);
			}, 2000);

			this._tickId = window.requestAnimationFrame(this.onTick);
		}
		else
		{
			console.warn("Container div doesn't exist");
		}
	}

	private async initBackground()
	{
		const canvas = this._canvas;

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

	private updateProjectiles(delta: number)
	{
		const activeProjectiles: Graphics[] = [];
		for (const projectile of this._projectiles)
		{
			projectile.position.x += this._projectileSpeed * delta;
			if (projectile.position.x - projectile.width / 2 < this._canvas.width)
			{
				activeProjectiles.push(projectile);
			}
			else
			{
				projectile.destroy();
			}
		}

		this._projectiles = activeProjectiles;
	}

	private isEnemyCollidingWithProjectiles(enemy: Sprite)
	{
		for (const projectiles of this._projectiles)
		{
			const isProjectileInsideBBoxOfEnemy = (
				enemy.position.x - enemy.width / 2 < projectiles.position.x &&
				projectiles.position.x < enemy.position.x + enemy.width / 2 &&
				enemy.position.y - enemy.height / 2 < projectiles.position.y &&
				projectiles.position.y < enemy.position.y + enemy.height / 2
			);

			if (isProjectileInsideBBoxOfEnemy)
			{
				return true;
			}
		}

		return false;
	}

	private updateEnemies(delta: number)
	{
		const activeEnemies: Sprite[] = [];

		for (const enemy of this._enemies)
		{
			enemy.position.x -= 0.03 * delta;

			if (this.isEnemyCollidingWithProjectiles(enemy))
			{
				this._explosionManager.startExplosion(enemy.position.x, enemy.position.y, this._currentTimeStamp);
				enemy.destroy();
			}
			else
			{
				activeEnemies.push(enemy);
			}
		}

		this._enemies = activeEnemies;
	}

	private onTick = () =>
	{
		this._currentTimeStamp = performance.now();
		this._delta = this._currentTimeStamp - this._prevTimeStamp;
		this._tickId = window.requestAnimationFrame(this.onTick);

		this.updateBackground(this._delta);
		this.updateProjectiles(this._delta);
		this.updateEnemies(this._delta);

		this._explosionManager.update(this._currentTimeStamp);

		this._prevTimeStamp = this._currentTimeStamp;
		//this._spaceShip.position.y = 200 + 50 * Math.sin(performance.now() / 1000);
	};
}