const makeWASocket = require("@adiwajshing/baileys").default;
const connectDB = require('./Database/connect')
const User = require("./Model/User")
const {pdfHandler} = require("./pdf")
const {registerHandler} = require("./register")
const {loginHandler} = require("./login")
const {
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} = require("@adiwajshing/baileys");
// start a connection
connectDB()
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
          var userDetails = await User.findOne({senderNumber: m.key.remoteJid})
  
          if(body.split(" ")[0].substring(1) == "register")
          {
            registerHandler({sock: sock, args: body, m: m})
          }
          else if(body.split(" ")[0].substring(1) == "login")
          {
            loginHandler({sock: sock, args: body, m: m})
          }
          else{
            
            if (!userDetails)
            {
              sock.sendMessage(m.key.remoteJid, {text: "Hey, create an account by using the command !register\n For example !register +254 7 xxxx xxxx"}, {quoted: m})
            }
            else if(userDetails && !userDetails.loggedIn )
            {
              sock.sendMessage(m.key.remoteJid, {text: "Please log in to continue"})
            }
          }
          if((body.substring(0, 1) == "!" || body.substring(0, 1) == ".") && userDetails.loggedIn){
          command = body.substring(1);
          if( body.split(" ")[0].substring(1) == "login"){
            loginHandler({sock: sock, args: body, m: m})
          }
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