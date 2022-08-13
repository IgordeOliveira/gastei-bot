const { GoogleSpreadsheet } = require('google-spreadsheet');

async function setup() {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      });

      await doc.loadInfo(); // loads document properties and worksheets
      return doc
}

async function save(description: String, category: String, value: String): Promise<Boolean>{
  const doc = await setup()

   value = value.replace('.',",")
   const sheet = doc.sheetsByIndex[2]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
   await sheet.loadHeaderRow(2);
   const row = await sheet.addRow({
    "Data": new Date().toLocaleDateString('pt-BR', { dateStyle: 'short' }),
    'Descrição':description,
    "Categoria": category,
    "Valor": value
   })

   if(row){
    return true
   }else{
    console.error("Error while saving row", row)
    return false
   }
}

export default save

  

