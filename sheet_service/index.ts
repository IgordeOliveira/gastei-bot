import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { PrismaClient, User } from '@prisma/client';

require('dotenv').config();

class SheetService {
  private telegramId: string
  private doc!: GoogleSpreadsheet;
  private user!: User;

  constructor(telegramId: string) {
    this.telegramId = telegramId
  }

  private async init() {
    const prisma = new PrismaClient()
    const userDb = await prisma.user.findUnique({ where: { telegram_id: this.telegramId } })
    if (!userDb) {
      throw new Error("Cannot find the user id by telegram id: " + this.telegramId)
    }
    this.user = userDb
    const googleDocId = this.user.document_id

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    this.doc = new GoogleSpreadsheet(googleDocId, serviceAccountAuth);
    await this.doc.loadInfo()

  }

  async initSheet() {
    await this.init()
    const sheet = await this.doc.addSheet({ title: "Transações", headerValues: ['Data', 'Descrição', 'Categoria', 'Valor'] })
    return sheet.sheetId
  }

  async save(description: string, category: string, value: string): Promise<Boolean> {
    await this.init()
    const sheetId = this.user?.sheet_id;
    const sheet = this.doc.sheetsById[sheetId]
    const row = await sheet.addRow([
      new Date().toLocaleDateString('pt-BR', { dateStyle: 'short' }),
      description,
      category,
      value
    ])

    if (row) {
      return true
    } else {
      console.error("Error while saving row", row)
      return false
    }
  }


}