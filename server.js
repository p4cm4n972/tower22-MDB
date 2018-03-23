const express = require("express");
const app = express();
const request = require('request');
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const server = require("http").createServer(app);
const io = require("socket.io",{transports: ['websocket']})(server);
//style console
const colors = require('colors');

const fs = require("fs");
const PDFDocument = require("pdfkit");

app.use(morgan("dev"));
app.use(
  bodyParser.urlencoded({
    extended: "true"
  })
);
app.use(bodyParser.json());
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "DELETE, PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.all("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(express.static(__dirname + '/dist'));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
})

//HEARTBEAT
app.post("/ws/heartbeat", function (req, res) {
  console.log("HeartbeatSV: ".red + req.body.Mode);
  io.emit("data", {
    data: req.body.Mode
  });
  res.json("heartbeat: " + req.body.Mode);
});
//EXPRESS SERVER
app.set("port", process.env.PORT || 5000);
server.listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});

//SOCKET CONNECTION
io.on("connection", function (socket) {
  console.log(`Socket ${socket.id} added`);
  socket.on("invoice", function (data) {
    console.log(data);
    doc = new PDFDocument({
      size: [300, 600]
    });
    doc.image('logo.png', 20, 15, 250);
    doc.moveDown();
    doc.text('7, rue d\'Alembert', 20, 100);
    doc.text('ZAC de la Noue Rousseau');
    doc.text('Techniparc');
    doc.text('91240 Saint Michel sur Orge');
    doc.moveDown();
    doc.fontSize(22).text('1 TICKET PASS', {
      align: 'center'
    });
    doc.fontSize(22).text('------------', {
      align: 'center'
    });
    doc.moveDown();
    doc.fontSize(14).text("Transaction n° :" + data.TransactionNumber);
    doc.fontSize(18).text("Prix TTC : " + data.total + ',00€', {
      align: 'center'
    });
    doc.moveDown();
    doc.text("TVA 10.0%            : " + ((data.total) / 10) + '€');
    doc.text("Montant total HT   : " + ((data.total) - ((data.total) / 10)) + '€');
    doc.text("Montant total TTC : " + (data.total) + ',00€');
    doc.moveDown();
    doc.font('UPC-A.ttf').fontSize(100).text(data.TransactionNumber, 50, 500);
    //doc.rect(doc.x, 155, 280, doc.y).stroke();
    doc.image('vision.png', 80, 530, 250);
    doc.pipe(fs.createWriteStream("/home/aplus/BorneProduit/Receipts/Receipt.pdf"));
    doc.end();
    request.post(
      "http://10.1.1.128:9010/ws/payment",{
        json: {
          "AmountToPay": (data.total * 100).toString(),
          "TransactionNumber":(data.TransactionNumber).toString()
        }
      }
    )
  });
  // CHECK CB
  socket.on('checkCB', function(data) {
    console.log('cb :' + data );
    request.post(
      "http://10.1.128:9010/ws/dataticket",{
      json: dataq
      }
    )
  });
  // PRINT RECEIPT
  socket.on('printReceipt', function(data) {
    console.log('RECU :' + data );
    
    request.post(
      "http://10.1.1.128:9010/ws/dataticket", {json: data}
    )
  })

  // STATUS
  app.post("/ws/status", function (req, res) {
    console.log("serverSideSocket: ".green + JSON.stringify(req.body.Mode));
    socket.emit("clientdata", {
      data: req.body
    });
    res.json("STATUS: " + req.body.Mode);
  });
  //PRINT
  app.post("/ws/cmdack", function (req, res) {
    console.log("cmdackSK: ".bgCyan + JSON.stringify(req.body.Acknowledge));
    //EMIT
    socket.emit("receipt", {
      data: (req.body.Acknowledge)
    });
    res.json(req.body.Acknowledge);
  });
  //PAYMENT
  app.post("/ws/receipt", function (req, res) {
    const dataticket = req.body;
    console.log("receiptSK: ".bgMagenta + JSON.stringify(dataticket.status));
    if (dataticket.status === "Transaction Accepted")
    {socket.emit("CB", {
      data: "CB"
    });} else if (dataticket.status === "Transaction Refused") {
      socket.emit("incident", { data : "incident"});
    }
    res.json("info CB");
  });
  // INCIDENT PAIEMENT
  app.post("/ws/incident", function (req, res) {
    const dataticket = req.body;
    console.log("receiptSK: ".bgMagenta + JSON.stringify(dataticket.TypeTicket));
    io.emit("incident", {
      data: "incident"
    });
    res.json("incident paiement");
  })
  socket.on('disconnect', function (data) {
    console.log('user disconnected');
    delete this.socket;
  });
});
