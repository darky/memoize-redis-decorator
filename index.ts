import * as Redis from 'ioredis';
import * as uuid from 'uuid';

class MemoizeRedis {
  argsResolver: (...args: any[]) => string
  ttl: number
  redisOptions: Redis.RedisOptions
  redis: Redis.Redis
  hash: string

  constructor({
    argsResolver, ttl, redisOptions
  }: {
    argsResolver?: (...args: any[]) => string,
    ttl?: number,
    redisOptions?: Redis.RedisOptions
  }) {
    this.argsResolver = argsResolver || ((...args) => JSON.stringify(args))
    this.ttl = ttl || 600
    this.redisOptions = redisOptions || {}
    this.redis = new Redis(this.redisOptions)
    this.hash = uuid.v4();
  }

  memoize () {
    const self = this;
    return (klass: any, methodName: string, desc: any) => {
      const origMethod = desc.value;
      desc.value = async function(...args: any[]) {
        const key = 'memoize-redis-decorator:'
          + klass.constructor.name + '.'
          + methodName + '.'
          + self.argsResolver(...args) + '.'
          + self.hash;
        const cached = await self.redis.get(key);
        if (cached) { return JSON.parse(cached); }
        const resp = await origMethod.apply(this, args);
        self.redis.set(key, JSON.stringify(resp));
        self.redis.expire(key, self.ttl)
        return resp;
      };
      return desc;
    }
  }
}

export {MemoizeRedis}
