# memoize-redis-decorator
Memoize decorator, backed by Redis

## Example

```typescript
import {MemoizeRedis} from 'memoize-redis-decorator'

const memoizeRedis = new MemoizeRedis({
  ttl: 600 // Time to live, default 600 seconds
  redisOptions: {} // Options, which directly passed to ioredis. By default, connected to locahost:6379
})

class MyClass {
  @memoizeRedis.memoize()
  async needCache(args) {
    // Some heavy stuff...
  }
}

```
