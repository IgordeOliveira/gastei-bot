import { Bot, Context, session, Keyboard, InlineKeyboard, SessionFlavor } from "grammy";
import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { PrismaAdapter } from "@grammyjs/storage-prisma";
import { PrismaClient } from "@prisma/client";
import { gasteiQuestions } from "./questions";
import dotenv from "dotenv"
import onboarding from "./onboarding";
dotenv.config()

interface SessionData {
  awnserQuestions: {
    category: string,
    description: string,
    value: string
  }
}
export type MyContext = ConversationFlavor<Context> & SessionFlavor<SessionData>;
export type MyConversation = Conversation<MyContext>;
export const confirmationKeyboard = new InlineKeyboard()
  .text("Ok", "ok")
  .text("Cancelar", "cancel")
const bot = new Bot<MyContext>(process.env.BOT_TOKEN ?? "");

const prisma = new PrismaClient();

bot.use(session({
  initial: () => ({ awnserQuestions: { category: '', description: '', value: '' } }),
  storage: new PrismaAdapter(prisma.session)
}));

bot.use(conversations());

bot.use(createConversation(gasteiQuestions));
bot.use(createConversation(onboarding));

bot.hears(['gastei', 'Gastei'], async (ctx) => {
  console.log("iniciando bot")
  await ctx.conversation.enter("gasteiQuestions");
});

bot.command('inicio', async ctx => {
  console.log("iniciando bot onboarding")
  await ctx.conversation.enter("onboarding");
});

bot.command('cancelar', async ctx => {
  await ctx.reply("Cancelado!");
  ctx.conversation.exit()
})

bot.on('message', async (ctx) => {
  console.log(ctx.chat)
  ctx.api.sendMessage(ctx.chat.id, "Bem vindo, para começar use /inicio ou /ajuda")
});


bot.callbackQuery("ok", async (ctx) => {
  await ctx.editMessageReplyMarkup()
  const { category, description, value } = ctx.session.awnserQuestions
  // const saved = await saveOnSheet(description, category, value);
  const saved = false;

  if (!saved) {
    await ctx.reply("Erro ao salvar tente novamente")
    await ctx.editMessageReplyMarkup({ reply_markup: confirmationKeyboard })
  }

  await ctx.reply("Salvo")
  await ctx.conversation.exit();
  console.log("finalizou bot")
});

bot.callbackQuery("cancel", async (ctx) => {
  await ctx.editMessageReplyMarkup()
  await ctx.reply("Cancelado!");
  await ctx.conversation.exit();
});



export default bot