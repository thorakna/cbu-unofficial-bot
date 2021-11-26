// Author: ONUR YAŞAR
const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');
dotenv.config();

client.on('ready', () => {
    console.log('Ready!');
    client.user.setActivity("Thorakna'yı", {type: 2}); 
});
client.on('message', message => {
    var gelen_msg = message.content.toLowerCase();
    if (gelen_msg === 'cbü-bot nedir' || gelen_msg === 'cbü bot nedir' || gelen_msg === 'cbu-bot nedir' || gelen_msg === 'cbu-bot ne la' || gelen_msg === 'cbu-bot ne' || gelen_msg === 'cbu bot ne la' || gelen_msg === 'cbu bot ne' || gelen_msg === 'cbü bot ne' || gelen_msg === 'cbu bot ne?') {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('Manisa Celal Bayar Üniversitesi öğrencilerinin kurduğu discord sunucuları için Thorakna tarafından geliştirilen bir discord botudur.');
        console.log('Bir soruya cevap verildi!! [cbu-bot-nedir]');
    }
});

client.login(process.env.API_KEY);
