import { Bot } from 'grammy'

if(!process.env['BOT_TOKEN']){
  throw new Error("Missing BOT_TOKEN env");
}

if(!process.env['WEBHOOK']){
  throw new Error("Missing WEBHOOK env");
}

const bot = new Bot(process.env['BOT_TOKEN'])
console.log("setting webhook url" +  process.env['WEBHOOK'] + "via telegram api")
bot.api.setWebhook(process.env['WEBHOOK'])
