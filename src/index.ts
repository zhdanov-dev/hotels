require('dotenv').config();
import createServer from './server';

const server = createServer();
server.listen(process.env.EXPRESS_LISTEN_PORT, () => {
	console.info(
		`Server started at http://localhost:${process.env.EXPRESS_LISTEN_PORT}`
	);
});
