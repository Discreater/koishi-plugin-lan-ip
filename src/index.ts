import { Context, Schema } from 'koishi'
import { getLanIp } from './network'

export const name = 'lan-ip'


export interface Config {
  botId: string,
  admin: string,
}

export const Config: Schema<Config> = Schema.object({
  botId: Schema.string().required(),
  admin: Schema.string().required(),
})

export function apply(ctx: Context, config: Config) {
  const logger = ctx.logger('lan-ip')
  if(config.botId) {
    ctx.on('bot-status-updated', async bot => {
      if(bot.status === 'online') {
        if(bot.selfId === config.botId) {
          const networks = getLanIp()
          await bot.sendPrivateMessage(config.admin, "こいし 已连接")
          logger.info(`got local ips: ${networks}`)
          await bot.sendPrivateMessage(config.admin, `lan ip: ${networks}`)
        }
      }
    })
    ctx.on('message', (session) => {
      if(session.content === "ip" && session.userId === config.admin) {
        const networks = getLanIp()
        logger.info(`got local ips: ${networks}`)
        session.send(`ip: ${networks}`)
      }
    })
  }
}