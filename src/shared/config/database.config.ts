
export const dbconfig = () => ({

    redis: {
        name: process.env.REDIS_CLIENT_NAME,
        url: process.env.REDIS_SERVER,
    }
})