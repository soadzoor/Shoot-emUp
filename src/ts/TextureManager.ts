import {Loader, Sprite} from "pixi.js";

export class TextureManager
{
	private _loader = new Loader();

	public loadSprite(path: string)
	{
		return new Promise<Sprite>((resolve, reject) =>
		{
			const resolveSprite = () =>
			{
				const sprite = new Sprite(this._loader.resources[path].texture);
				resolve(sprite);
			};

			if (this._loader.resources[path]?.texture)
			{
				resolveSprite();
			}
			else
			{
				this._loader.add(path).load(() =>
				{
					resolveSprite();
				});
			}
		});
	}
}