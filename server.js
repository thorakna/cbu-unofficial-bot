// Author: ONUR YAŞAR
const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const cheerio = require('cheerio');

const prefix = "cbu."

const duyuruCek = async () => {
    var response = await axios({
        method: 'get',
        url: 'https://bilgisayarmuh.mcbu.edu.tr/'
    });
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
        return customLiArray;
    }else{
        return response.status;
    }
}

client.on('ready', () => {
    console.log('Ready!');
    client.user.setActivity("Thorakna'yı", {type: 2}); 
});

client.on('message', async message => {
    var gelen_msg = message.content.toLowerCase();
    if (gelen_msg === 'cbü-bot nedir' || gelen_msg === 'cbü bot nedir' || gelen_msg === 'cbu bot nedir' || gelen_msg === 'cbu-bot nedir' || gelen_msg === 'cbu-bot ne la' || gelen_msg === 'cbu-bot ne' || gelen_msg === 'cbu bot ne la' || gelen_msg === 'cbu bot ne' || gelen_msg === 'cbü bot ne' || gelen_msg === 'cbu bot ne?') {
        message.channel.send('Manisa Celal Bayar Üniversitesi öğrencilerinin kurduğu discord sunucuları için Thorakna tarafından geliştirilen bir discord botudur.');
        console.log('Bir soruya cevap verildi!! [cbu-bot-nedir]');
    }else if(gelen_msg === prefix+'sonduyuru'){
        var duyurular = await duyuruCek();
        if(!Array.isArray(duyurular)){
            message.channel.send("Hata: "+duyurular);
        }else{
            const Embed = new Discord.MessageEmbed()
            .setColor([22,191,217])
            .setTitle(duyurular[0].title)
            .setDescription(duyurular[0].url)
            .setFooter(duyurular[0].date);

            message.channel.send(Embed);
            message.react('👌');
        }
    }else if(gelen_msg === prefix+'duyurular'){
        var duyurular = await duyuruCek();
        if(!Array.isArray(duyurular)){
            message.channel.send("Hata: "+duyurular);
        }else{
            var duyuruString = "";
            for(var i=0; i < 15; i++){
                duyuruString += duyurular[i].title+"\n";
                duyuruString += duyurular[i].url+"\n\n";
            }
            const Embed = new Discord.MessageEmbed()
                .setColor([22,191,217])
                .setTitle("Son 15 Duyuru")
                .setDescription(duyuruString)
                .setFooter("Veriler bilgisayarmuh.mcbu.edu.tr adresinden alınmıştır.");
            message.channel.send(Embed);
            message.react('👌');
        }
    }
});

client.login(process.env.API_KEY);
