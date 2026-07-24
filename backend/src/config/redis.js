const { createClient } = require('redis');

// Support full Redis URI (Upstash format) or fallback to individual configurations
const redisClient = createClient(
    process.env.REDIS_URL ? { url: process.env.REDIS_URL } : {
        username: 'default',
        password: process.env.REDIS_PASS,
        socket: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT) 
        }
    }
);

module.exports = redisClient;