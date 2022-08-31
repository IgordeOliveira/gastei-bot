import { Bot, Context, session, Keyboard, InlineKeyboard, SessionFlavor } from "grammy";
import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { freeStorage } from "@grammyjs/storage-free";

import saveOnSheet from './sheetService'
// import dotenv from "dotenv"
// dotenv.config()


interface SessionData {
    awnserQuestions: {
        category: String,
        description: String,
        value: String
    };
  }
  
type MyContext = Context & ConversationFlavor & SessionFlavor<SessionData>;
type MyConversation = Conversation<MyContext>;

const bot = new Bot<MyContext>(process.env.BOT_TOKEN ?? "", {
  client: {
    // We accept the drawback of webhook replies for typing status.
    canUseWebhookReply: (method) => method === "sendChatAction",
  }});


bot.use(session({
  initial: () => ({ awnserQuestions: {category: '', description: '', value: ''} }),
  storage: freeStorage<SessionData>(bot.token),
}));
bot.use(conversations());

const categorias = ["Despesas fixas", "Alimentação", "Transporte", "Moradia", "Vestuário", "Saúde", "Personal", "Lazer", "Tia Leia", "Thiago"];


const confirmationKeyboard = new InlineKeyboard()
    .text("Ok", "ok")
    .text("Cancelar", "cancel")
    
/** Defines the conversation */
async function gasteiQuestions(conversation: MyConversation, ctx: MyContext) {
    const categoryKeyboard = new Keyboard().oneTime()
    categorias.forEach((categoria, index) => {
        categoryKeyboard.text(categoria)
        if(index % 3 == 0) categoryKeyboard.row()
    })
    await ctx.reply("Em qual categoria ?", {
        reply_markup: categoryKeyboard,
    });

    let cvsContext = await conversation.waitFor("message:text");
    const category = cvsContext.msg.text

    await ctx.reply("Ok, e a qual a descrição ?", {
        reply_markup: { remove_keyboard: true },
      });
    cvsContext = await conversation.waitFor("message:text");
    const description = cvsContext.msg.text

    await ctx.reply("Ok, e a qual foi o valor ?");
    cvsContext = await conversation.waitFor("message:text");
    const value = cvsContext.msg.text

    await ctx.reply(`*Categoria*: ${category}\n*Descrição*: ${description}\n*Valor*: R$ ${value.replace('.',",")}\n\nConfirma?`, {
        parse_mode: "MarkdownV2",
        reply_markup: confirmationKeyboard,
    });

    
    cvsContext.session.awnserQuestions = {category, description, value}
}

bot.callbackQuery("ok", async (ctx) => {
    await ctx.editMessageReplyMarkup()
    const {category, description, value} = ctx.session.awnserQuestions
    const saved = await saveOnSheet(description,category,value);

    if(!saved){
        await ctx.reply("Erro ao salvar tente novamente")
        await ctx.editMessageReplyMarkup({reply_markup: confirmationKeyboard})
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
  

bot.use(createConversation(gasteiQuestions));

bot.hears(['gastei', 'Gastei'], async (ctx) => {
  console.log("iniciando bot")
  await ctx.conversation.enter("gasteiQuestions");
});

bot.command('cancelar', async ctx => {
    await ctx.reply("Cancelado!");
    ctx.conversation.exit()
})


export default bot