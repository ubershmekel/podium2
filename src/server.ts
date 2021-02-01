import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import socketio from 'socket.io';
import { onConnect } from './server/server-sockets';



const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const {server} = polka() // You can also use Express
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
	)
	.listen(PORT, (err: Error) => {
		if (err) console.log('error', err);
	});

const io = new socketio.Server(server, {
	cors: {
		// origin: 'http://localhost:5000',
		origin: '*',
	}
});

io.on('connection', function(socket) {
	socket.on('hi', (res: string) => console.log('socket hi res', res));
})
io.on('connection', onConnect);

// server.listen(PORT, _ => {
// 	console.log(`> Running on localhost:${PORT}`);
// });