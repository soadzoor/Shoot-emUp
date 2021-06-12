import {Loader, Sprite, Texture, TilingSprite} from "pixi.js";

export class TextureManager
{
	private _loader = new Loader();

	public loadSprite(path: string, tiling: boolean = false)
	{
		return new Promise<Sprite | TilingSprite>((resolve, reject) =>
		{
			const resolveSprite = () =>
			{
				const texture = this._loader.resources[path].texture as Texture;
				const sprite = tiling ? new TilingSprite(texture, texture.width, texture.height) : new Sprite(texture);
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