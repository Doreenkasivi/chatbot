
module.exports = {
    async registerHandler({sock, args, m}){
        try {
            const User = require("./Model/User")
            const otpGenerator = require('otp-generator')
            var otp =  otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, digits: true });
            var arg = args.split(" ")
            var username = m.pushName
            var phonenumber = arg[1]
            var verificationNumber = phonenumber+"@s.whatsapp.net"
            sock.sendMessage(m.key.remoteJid, {text: "Registering..."}, {quoted: m})
            console.log(username, verificationNumber, otp)
            var registered = await User.findOne({phonenumber: phonenumber})
            if (registered)
            {
                await sock.sendMessage(m.key.remoteJid, {text: "The number you entered is already registered!"}, {quoted: m})
            }
            else
            {
                var registerDetails = User({
                    senderNumber: m.key.remoteJid,
                    username: username,
                    phonenumber: phonenumber,
                    otp: otp,
                    loggedIn: false
                })
                
                await registerDetails.save()
                await sock.sendMessage(m.key.remoteJid, {text: "Registration done!"}, {quoted: m})
                await sock.sendMessage(verificationNumber, {text: `Your number was used to register account with ChatBot.\n\n One-Time-Password: *${otp}*`})

            }

            
        } catch (error) {
            await sock.sendMessage(m.key.remoteJid, {text: "Registration failed. Internal server error!"}, {quoted: m})
        }
    }
}
    