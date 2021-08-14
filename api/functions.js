/** @param print Fancy console.log();*/
async function print(output) {
	let TimeStamp = Date.now();

	let NewDate = new Date(TimeStamp);
	let date = NewDate.getDate();
	let month = NewDate.getMonth() + 1;
	let year = NewDate.getFullYear();
	let hours = NewDate.getHours();
	let minutes = NewDate.getMinutes();
	let seconds = NewDate.getSeconds();

	console.log(`[${month}/${date}/${year} | ${hours}:${minutes}:${seconds}]: ${output}`);
}

function GetDate() {
	let today = new Date();
	let dd = String(today.getDate()).padStart(2, '0');
	let mm = String(today.getMonth() + 1).padStart(2, '0');
	let yyyy = today.getFullYear();

	return mm + '/' + dd + '/' + yyyy;
}

function GetTime() {
	let TimeStamp = Date.now();

	let NewDate = new Date(TimeStamp);
	let hours = NewDate.getHours();
	let minutes = NewDate.getMinutes();
	let seconds = NewDate.getSeconds();

	return `${hours}:${minutes}:${seconds}`;
}

module.exports = { print, GetDate, GetTime };