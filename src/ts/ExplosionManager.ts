import {ParticleContainer, Sprite, Texture} from "pixi.js";

interface IParticleGroup
{
	initialData: {
		position: {x: number, y: number};
		timeStamp: number;
	},
	sprites: Sprite[];
}

export class ExplosionManager
{
	private _texture: Texture;
	private _particleContainer: ParticleContainer = new ParticleContainer(200, {scale: true, alpha: true});
	private _activeParticleGroups: IParticleGroup[] = [];
	private readonly _explosionDuration: number = 500; // ms
	private readonly _explosionRadius: number = 300; // px
	private readonly _particleMinScale: number = 0.5;
	private readonly _particleMaxScale: number = 2;

	constructor(texture: Texture)
	{
		this._texture = texture;
	}

	public get container()
	{
		return this._particleContainer;
	}

	public update(timeStamp: number)
	{
		const newActiveParticleGroup: IParticleGroup[] = [];

		for (const activeParticleGroup of this._activeParticleGroups)
		{
			const elapsedTimeFromStart = timeStamp - activeParticleGroup.initialData.timeStamp;
			const progress = elapsedTimeFromStart / this._explosionDuration;

			if (progress < 1)
			{
				const numberOfSprites = activeParticleGroup.sprites.length;

				for (let i = 0; i < numberOfSprites; ++i)
				{
					const sprite = activeParticleGroup.sprites[i];
					const trigonometricParam = 2 * Math.PI * i / numberOfSprites;
					const dx = progress * Math.cos(trigonometricParam) * this._explosionRadius;
					const dy = progress * Math.sin(trigonometricParam) * this._explosionRadius;

					sprite.x = activeParticleGroup.initialData.position.x + dx;
					sprite.y = activeParticleGroup.initialData.position.y + dy;

					sprite.alpha = 1 - progress;

					const newScale = this._particleMinScale + (this._particleMaxScale - this._particleMinScale) * progress;
					sprite.scale.set(newScale, newScale);
				}
				newActiveParticleGroup.push(activeParticleGroup);
			}
			else
			{
				for (const sprite of activeParticleGroup.sprites)
				{
					sprite.destroy();
				}
			}
		}

		this._activeParticleGroups = newActiveParticleGroup;
	};

	public startExplosion(x: number, y: number, timeStamp: number)
	{
		const sprites: Sprite[] = [];
		const numberOfParticles = 10;

		const initialData = {
			timeStamp: timeStamp,
			position: {
				x: x,
				y: y
			}
		};

		for (let i = 0; i < numberOfParticles; ++i)
		{
			const particle = new Sprite(this._texture);
			particle.anchor.set(0.5, 0.5);
			particle.position.set(x, y);
			particle.scale.set(this._particleMinScale, this._particleMinScale);
			this._particleContainer.addChild(particle);
			sprites.push(particle);
		}

		this._activeParticleGroups.push({
			initialData,
			sprites
		});
	}
}