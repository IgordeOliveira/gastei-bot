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
Object.defineProperty(exports, "__esModule", { value: true });
const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const doc = new GoogleSpreadsheet("");
        yield doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY,
        });
        yield doc.loadInfo(); // loads document properties and worksheets
        return doc;
    });
}
function save(description, category, value) {
    return __awaiter(this, void 0, void 0, function* () {
        const doc = yield setup();
        value = value.replace('.', ",");
        const sheet = doc.sheetsByIndex[2]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
        yield sheet.loadHeaderRow(2);
        const row = yield sheet.addRow({
            "Data": new Date().toLocaleDateString('pt-BR', { dateStyle: 'short' }),
            'Descrição': description,
            "Categoria": category,
            "Valor": value
        });
        if (row) {
            return true;
        }
        else {
            console.error("Error while saving row", row);
            return false;
        }
    });
}
exports.default = save;
