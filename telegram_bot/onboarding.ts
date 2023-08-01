import { MyContext, MyConversation } from ".";

async function onboarding(conversation: MyConversation, ctx: MyContext) {
    await ctx.reply("Otimo!, agora, qual id da planilha?");
    let cvsContext = await conversation.waitFor("message:text");
    const documentId = cvsContext.msg.text
    console.log(documentId)
    await ctx.reply("Beleza")
    await ctx.conversation.exit();
}

export default onboarding;