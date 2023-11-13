import 'dotenv/config';
import readline from 'readline';
import spinner from 'cli-spinners';
import Bot from './bot.js';

const NODE_ENV = process.env.NODE_ENV;
const COOKIE_KEY = process.env.COOKIE_KEY; // como obtener la cookie key: https://bard-ai.js.org/prerequisites/authentication/
let intervalo;

consoleInit();
loadingInit();
var bot = new Bot(COOKIE_KEY);
setTimeout(init, 5000);

async function init() {
	let username = '';
	loadingEnd();
	console.log(`CONTEXT: ${bot.context}\n`);

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	loadingEnd();
	console.log(`📒 te dejo algunas indicaciones:\n -"chau" finaliza la charla\n -"chatid" te muestra el id de esta charla\n -"reset" resetea la charla generando una nueva\n`);

	rl.question('👤 Como te llamás? ', (input) => {
		if (NODE_ENV === 'dev') { eraseLine() };
		askBot(`Hola! Mi nombre es ${input}`)
			.then(response => {				
				botResponse(response);
				rl.prompt();
			})
	});

	rl.on('line', (line) => {
		switch (line) {
			case 'chau':
				if (NODE_ENV === 'dev') { eraseLine() };
				rl.close();
				break;

			case 'chatid':
				if (NODE_ENV === 'dev') { eraseLine() };
				botResponse(bot.chatId);
				break;

			case 'reset':
				if (NODE_ENV === 'dev') { eraseLine() };
				bot = new Bot(COOKIE_KEY, null, true);
				break;

			default:
				if (NODE_ENV === 'dev') { eraseLine() };
				askBot(line)
					.then(response => {
						botResponse(response);
						rl.prompt();
					})
					.catch(error => { botResponse(error) });
				break;
		}
	});

	rl.on('close', () => {
		botResponse('Nos olemos al rato!');
		process.exit(0);
	});
}

async function askBot(question) {
	try {
		loadingInit();
		return await bot.chat(question || '');
	} catch (error) {
		return { error };
	}
}

function botResponse(text) {
	const COLORS = { reset: '\x1b[0m', negro: '\x1b[30m', rojo: '\x1b[31m', verde: '\x1b[32m', amarillo: '\x1b[33m', azul: '\x1b[34m', magenta: '\x1b[35m', cyan: '\x1b[36m', blanco: '\x1b[37m' };
	try {
		loadingEnd();
		console.log(`${COLORS['azul']}${bot.botName}${COLORS['reset']}`, text.replace(/\n\s*\n/g, '\n').replace(/\*\*/g, ''));
	} catch (error) {
		console.log(`${COLORS['rojo']}ERROR:${COLORS['reset']}`, 'Ocurrio un error, por favor aguarda un momento y reintenta');
	}
}

function consoleInit() {
	console.clear();
	console.log('*********************************************************************************************');
	console.log(' GOOGLE BARD TEST');
	console.log(' __Secure1PSID: ', COOKIE_KEY);
	console.log('*********************************************************************************************\n');
	console.log(' ');
}

export function eraseLine() {
	process.stdout.moveCursor(0, -1);
	process.stdout.clearLine();
}

export function loadingInit() {
	let i = 0;
	intervalo = setInterval(() => {
		process.stdout.write(`\r${spinner.dots.frames[i]} `);
		i = (i + 1) % spinner.dots.frames.length;
	}, spinner.dots.interval);
}

export function loadingEnd() {
	clearInterval(intervalo);
	process.stdout.moveCursor(-2, 0);
	process.stdout.clearLine();
}