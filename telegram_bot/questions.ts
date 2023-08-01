import { createConversation } from "@grammyjs/conversations";
import { InlineKeyboard, Keyboard } from "grammy";
import { MyContext, MyConversation, confirmationKeyboard } from ".";

const categorias = ["Despesas fixas", "Alimentação", "Transporte", "Moradia", "Vestuário", "Saúde", "Personal", "Lazer", "Tia Leia", "Thiago"];

/** Defines the conversation */
export async function gasteiQuestions(conversation: MyConversation, ctx: MyContext) {
    const categoryKeyboard = new Keyboard().oneTime()
    categorias.forEach((categoria, index) => {
        categoryKeyboard.text(categoria)
        if (index % 3 == 0) categoryKeyboard.row()
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

    await ctx.reply(`*Categoria*: ${category}\n*Descrição*: ${description}\n*Valor*: R$ ${value.replace('.', ",")}\n\nConfirma?`, {
        parse_mode: "MarkdownV2",
        reply_markup: confirmationKeyboard,
    });


    cvsContext.session.awnserQuestions = { category, description, value }
}

