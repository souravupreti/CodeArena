const { createClient }  = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
       host: 'redis-17490.c305.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 17490
    }
});

module.exports = redisClient;