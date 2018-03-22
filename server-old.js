//PRINT TICKET
doc = new PDFDocument({
    size: [300]
  });
  doc.text('CARTE BANCAIRE', {
    align: 'center'
  });
  doc.moveDown();
  doc.text(dataticket.SubContractorId, 20, 15);
  doc.text('le' + dataticket.Date);
  doc.text(dataticket.AdressLine1);
  doc.text('APLUS SA');
  doc.text(dataticket.NumCarte);
  doc.text(dataticket.IdCarte);
  doc.text(dataticket.TypeCarteBancaire);
  doc.text('MONTANT REEL =' + dataticket.Montant);
  doc.text(dataticket.TypeTransaction);
  doc.text(dataticket.TypeTicket);
  doc.text('A CONSERVER');
  doc.pipe(fs.createWriteStream("../BorneProduit/DataTicket/dataticket.pdf"));
  doc.end();