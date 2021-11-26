// Author: ONUR YAŞAR
const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const cheerio = require('cheerio');


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
    }else if(gelen_msg === 'gelbklm'){
        console.log('Böyle bir komut geldi');
        axios({
            method: 'get',
            url: 'https://bilgisayarmuh.mcbu.edu.tr/'
        })
            .then(function (response) {
                if(response.status === 200){
                    const $ = cheerio.load(response.data);
                    let customLiArray = [];
                    $('#sc1 .CustomLi').each(function(i, elem) {
                        customLiArray[i] = {
                            title: $(this).find('p').text().trim(),
                            url: $(this).find('a').attr('href'),
                            date: $(this).find('h4').text()
                        } 
                    });
                    console.log(customLiArray[0]);
                }else{
                    message.channel.send("Hata: "+response.status);
                }
        });
        console.log('Kral çalıştı!');
    }
});

client.login(process.env.API_KEY);
