"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const conversations_1 = require("@grammyjs/conversations");
const storage_free_1 = require("@grammyjs/storage-free");
const sheetService_1 = __importDefault(require("./sheetService"));
console.log('token', process.env.BOT_TOKEN);
const bot = new grammy_1.Bot((_a = process.env.BOT_TOKEN) !== null && _a !== void 0 ? _a : "", {
    client: {
        // We accept the drawback of webhook replies for typing status.
        canUseWebhookReply: (method) => method === "sendChatAction",
    }
});
bot.use((0, grammy_1.session)({
    initial: () => ({ awnserQuestions: { category: '', description: '', value: '' } }),
    storage: (0, storage_free_1.freeStorage)(bot.token),
}));
bot.use((0, conversations_1.conversations)());
const categorias = ["Despesas fixas", "Alimentação", "Transporte", "Moradia", "Vestuário", "Saúde", "Personal", "Lazer", "Tia Leia", "Thiago"];
const confirmationKeyboard = new grammy_1.InlineKeyboard()
    .text("Ok", "ok")
    .text("Cancelar", "cancel");
/** Defines the conversation */
function gasteiQuestions(conversation, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const categoryKeyboard = new grammy_1.Keyboard().oneTime();
        categorias.forEach((categoria, index) => {
            categoryKeyboard.text(categoria);
            if (index % 3 == 0)
                categoryKeyboard.row();
        });
        yield ctx.reply("Em qual categoria ?", {
            reply_markup: categoryKeyboard,
        });
        let cvsContext = yield conversation.waitFor("message:text");
        const category = cvsContext.msg.text;
        yield ctx.reply("Ok, e a qual a descrição ?", {
            reply_markup: { remove_keyboard: true },
        });
        cvsContext = yield conversation.waitFor("message:text");
        const description = cvsContext.msg.text;
        yield ctx.reply("Ok, e a qual foi o valor ?");
        cvsContext = yield conversation.waitFor("message:text");
        const value = cvsContext.msg.text;
        yield ctx.reply(`*Categoria*: ${category}\n*Descrição*: ${description}\n*Valor*: R$ ${value.replace('.', ",")}\n\nConfirma?`, {
            parse_mode: "MarkdownV2",
            reply_markup: confirmationKeyboard,
        });
        cvsContext.session.awnserQuestions = { category, description, value };
    });
}
bot.callbackQuery("ok", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.editMessageReplyMarkup();
    const { category, description, value } = ctx.session.awnserQuestions;
    const saved = yield (0, sheetService_1.default)(description, category, value);
    if (!saved) {
        yield ctx.reply("Erro ao salvar tente novamente");
        yield ctx.editMessageReplyMarkup({ reply_markup: confirmationKeyboard });
    }
    yield ctx.reply("Salvo");
    // await ctx.reply(res.data.fact)
    yield ctx.conversation.exit();
    console.log("finalizou bot");
}));
bot.callbackQuery("cancel", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.editMessageReplyMarkup();
    yield ctx.reply("Cancelado!");
    yield ctx.conversation.exit();
}));
bot.use((0, conversations_1.createConversation)(gasteiQuestions));
bot.hears(['gastei', 'Gastei'], (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("iniciando bot");
    yield ctx.conversation.enter("gasteiQuestions");
}));
bot.command('cancelar', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply("Cancelado!");
    ctx.conversation.exit();
}));
exports.default = bot;
