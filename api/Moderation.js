const { FetchData, UpdateData } = require('./FireData');

async function strike(user) {
	let { Strikes } = await FetchData(user);

	if (isNaN(Strikes) || !Strikes) Strikes = 0;

	Strikes++;

	await UpdateData(user, {
		Strikes: Strikes,
	});

	return Strikes;
}

module.exports = { strike };