import {Loader, Sprite, Texture, TilingSprite} from "pixi.js";

export class TextureManager
{
	private _loader = new Loader();

	public loadSprite(path: string, tiling: boolean = false)
	{
		return new Promise<Sprite | TilingSprite>(async (resolve, reject) =>
		{
			const texture = await this.loadTexture(path);
			const sprite = tiling ? new TilingSprite(texture, texture.width, texture.height) : new Sprite(texture);
			resolve(sprite);
		});
	}

	public loadTexture(path: string)
	{
		return new Promise<Texture>((resolve, reject) =>
		{
			if (this._loader.resources[path]?.texture)
			{
				resolve(this._loader.resources[path].texture as Texture);
			}
			else
			{
				this._loader.add(path).load(() =>
				{
					resolve(this._loader.resources[path].texture as Texture);
				});
			}
		});
	}
}