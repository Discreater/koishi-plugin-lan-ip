import os from "os";

export function getLanIp(): string[] {
    const networks: string[] = []
    Object.values(os.networkInterfaces())
        .flatMap((nInterface) => nInterface ?? [])
        .filter((detail) =>
            detail &&
            detail.address &&
            ((typeof detail.family === 'string' && detail.family === 'IPv4') ||
                // @ts-expect-error Node 18.0 - 18.3 returns number
                (typeof detail.family === 'number' && detail.family === 4)),
        )
        .forEach((detail) => {
            const host = detail.address
            networks.push(host)
        })
    return networks
}