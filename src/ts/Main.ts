import {GameEngine} from "GameEngine";

export class Main
{
	private _gameEngine: GameEngine;
	private _menu = document.getElementById("menu");

	constructor()
	{
		this.init();
	}

	private async init()
	{
		await this.hideSplashScreen();

		const gameButtonIds = ["game1", "game2", "game3"];
		for (const gameButtonId of gameButtonIds)
		{
			document.getElementById(gameButtonId)?.addEventListener("click", this.onPlayClick);
		}

		document.getElementById("exit")?.addEventListener("click", () =>
		{
			window.location.href = "https://github.com/soadzoor";
		});
	}

	private onPlayClick = async () =>
	{
		this._menu?.classList.add("hidden");
		this._gameEngine = new GameEngine(this);
		await this._gameEngine.init();
	};

	private hideSplashScreen()
	{
		return new Promise<void>((resolve, reject) =>
		{
			const splashScreen = document.getElementById("splashScreen");

			if (splashScreen)
			{
				const fadeDuration = 1000; // ms
				splashScreen.style.transition = `opacity ${fadeDuration}ms ease-out`;
				setTimeout(() =>
				{
					if (splashScreen)
					{
						splashScreen.style.opacity = "0";
					}
					setTimeout(() =>
					{
						splashScreen.remove();
						resolve();
					}, fadeDuration);
				}, 2000);
			}
			else
			{
				reject("HTML element doesn't exist");
			}
		});
	}

	public get menu()
	{
		return this._menu;
	}
}

const main = new Main();