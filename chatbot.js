const makeWASocket = require("@adiwajshing/baileys").default;
const {pdfHandler} = require("./pdf")
const {
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} = require("@adiwajshing/baileys");
// start a connection
const startSock = async () => {
const { version } = await fetchLatestBaileysVersion();
const { state, saveCreds } = await useMultiFileAuthState("auth_info_multi");
const sock = makeWASocket({
  browserer: ["ChatBot"],
  printQRInTerminal: true,
  auth: state,
});

sock.ev.on("messages.upsert", async ({ messages }) => {
  let m = messages[0];
  if (m.message != undefined && m.message != null) {
      if (m.key.fromMe == false) {
        if (m.key.remoteJid.split("@")[1] !== "g.us") {
         var body = m.message.conversation.toLocaleLowerCase()
          if(body.substring(0, 1) == "!" || body.substring(0, 1) == "."){
            command = body.substring(1);
            if(body.split(" ")[0].substring(1) == "pdf")
            {
              pdfHandler({sock: sock, args: body, m: m})
            }
          }
        }
      }
    }
    


});

  // sock.ev.on('message-receipt.update', m => console.log(m))
  // sock.ev.on('presence.update', m => console.log(m))
  // sock.ev.on('chats.upsert', m => console.log(m))
  // sock.ev.on('contacts.upsert', m => console.log(m))

  //  this is a conection update

  //Connection Update
  sock.ev.on("connection.update", (update) => {
    const { connection } = update;
    if (connection === "close") {
      startSock();
    }

    console.log("connection update", update);
  });
  // listen for when the auth credentials is updated
  sock.ev.on("creds.update", saveCreds);

  return sock;
};
//Starting AlitaBot
startSock();