var redis = require('redis'),
    url = require('url'),
    config = require('../../config/config'),
    messages = require('../../public/lib/messages.js');

/**
 */
function RedisCache(ttl) {
    var redisURL = url.parse(config.redis.url),
        client = redis.createClient(redisURL.port, 
                                    redisURL.hostname, 
                                    {no_ready_check: true});

    client.auth(redisURL.auth.split(':')[1]);
    console.log("Redis: connected to " + redisURL.hostname);

    this.ttl = ttl;
    this.client = client;
}

RedisCache.prototype.setEntry = function (entry, value) {
    this.client.set(entry, value.toString());
    this.client.expire(entry, this.ttl);
    return value;
};

RedisCache.prototype.getEntry = function (entry, callback) {
    this.client.get(entry, function (error, value) {
        callback(error, messages.Response.fromString(value));                
    });
};

module.exports = RedisCache;
