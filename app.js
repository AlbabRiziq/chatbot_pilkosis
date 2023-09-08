const mongodb = require("mongodb");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const MongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017";

const client = new Client({
  authStrategy: new LocalAuth({ clientId: "client-one" }),
});

const clientMongo = new MongoClient(url, {});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});
client.on("message", (message) => {
  if (message.body === "!ping") {
    message.reply("pong");
  }
});

client.on("message", async (message) => {
  try {
    const db = clientMongo.db("pilkosis");
    const user = db.collection("user");

    if (message.body.includes("/get")) {
      const pesan = message.body.split("_");
      const username = pesan[0].replace("/get ", "");
      const ibu = pesan[1].toUpperCase();

      console.log(username, ibu);

      const balasan = await user.findOne({
        username: username,
        Ibu: ibu,
      });

      console.log(balasan);

      if (balasan) {
        message.reply(`Halo *${balasan.nama}*, anda sudah terdaftar sebagai pemilih, password anda adalah *${balasan.password}*

        `);
      } else {
        message.reply(`Data tidak ditemukan
        Silahkan hubungi nomor berikut untuk informasi lebih lanjut

        https://wa.me/message/KJL5XZYGFLQDG1`);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

client.initialize();
