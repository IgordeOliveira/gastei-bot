import { webhookCallback } from "grammy";
import { autoRetry } from "@grammyjs/auto-retry";

import bot from '../bot'

bot.api.config.use(autoRetry());


export default webhookCallback(bot, 'http')
