import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)
export async function checkToken(jwt: string): Promise<string|null> {
    const value = redis.get(jwt)
    if(value){
        return value
    }

    return null
}
