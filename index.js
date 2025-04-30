const fastify = require('fastify')({ logger: true });
const metrics = require('fastify-metrics');
const path = require('path');
const fs = require('fs');
const util = require('util');
const pump = util.promisify(require('stream').pipeline);

// const fastify = Fastify({ logger: true });
fastify.register(metrics, { endpoint: '/metrics' });

fastify.register(require('@fastify/multipart'));
fastify.register(require('@fastify/static'), {
	root: path.join(__dirname, 'uploads'),
	prefix: '/uploads/',
});

fastify.post('/upload/avatar', async (req, reply) => {
	const data = await req.file();
	const filename = `${Date.now()}-${data.filename}`;
	const filepath = path.join(__dirname, 'uploads/avatars', filename);

	await pump(data.file, fs.createWriteStream(filepath));

	return { path: `/uploads/avatars/${filename}` };
})

fastify.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	fastify.log.info(`Server listening at ${address}`);
});
