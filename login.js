module.exports = {
    async loginHandler({sock, args, m}){
        try {
            var arg = args.split(" ")
            var otp_sender = arg[1]
            const User = require("./Model/User")
            var userDetails = await User.findOne({senderNumber: m.key.remoteJid})

            if (userDetails.otp === otp_sender ){
                var filter = { senderNumber: m.key.remoteJid };
                var update = { loggedIn: true };
                await User.findOneAndUpdate(filter, update);
                await sock.sendMessage(m.key.remoteJid, {text: "Logged in"})
            }
            else{
                await sock.sendMessage(m.key.remoteJid, {text: "Invalid OTP!"})
            }
            console.log("Correct : " +userDetails.otp+ " Recieved OTP: "+otp_sender)
        } catch (error) {
            await sock.sendMessage(m.key.remoteJid, {text: "Log in failed. Internal server error!"})
        }

    }
}