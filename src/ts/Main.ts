export class Main
{
	constructor()
	{
		this.init();
	}

	private async init()
	{
		await this.hideSplashScreen();		
	}

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
}

const main = new Main();