// Author: ONUR YAŞAR
const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile')
const dataFile = './tmp/data.json';

const prefix = "cbu."

const kanalSil = (arr, value) => { 
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

const duyuruKaydet = (duyuru) => {
    jsonfile.readFile(dataFile)
        .then(obj => {
            if(JSON.stringify(obj.sonduyuru) != JSON.stringify(duyuru)){
                obj.sonduyuru = duyuru;
                jsonfile.writeFile(dataFile, obj, function (err) {
                    if (err) console.error(err)
                });
            }
        })
        .catch(error => console.error(error));
}

const duyuruCek = async () => {
    var response = await axios({
        method: 'get',
        url: 'https://bilgisayarmuh.mcbu.edu.tr/'
    });
    if (response.status === 200) {
        const $ = cheerio.load(response.data);
        let customLiArray = [];
        $('#sc1 .CustomLi').each(function (i, elem) {
            customLiArray[i] = {
                title: $(this).find('p').text().trim(),
                url: $(this).find('a').attr('href'),
                date: $(this).find('h4').text()
            }
        });
        duyuruKaydet(customLiArray[0]);
        return customLiArray;
    } else {
        return response.status;
    }
}

client.on('ready', () => {
    console.log('Ready!');
    
    const otoDuyuru = async () =>{
        var duyurular = await duyuruCek();
        jsonfile.readFile(dataFile)
            .then(obj => {
                if(JSON.stringify(obj.sonduyuru) != JSON.stringify(duyurular[0])){
                    console.log("[Otoduyuru] Kontrol edildi, yeni duyuru yayınlandı!");
                    const Embed = new Discord.MessageEmbed()
                        .setColor([22, 191, 217])
                        .setTitle(duyurular[0].title)
                        .setDescription(duyurular[0].url)
                        .setFooter(duyurular[0].date);
                    obj.kanallar.forEach(el => {
                        client.channels.cache.get(el).send('<@&781806139989426197>', {
                            embed: Embed,
                        });
                    });
                    duyuruKaydet(duyurular[0]);
                }else{
                    console.log("[Otoduyuru] Kontrol edildi, yeni duyuru yok!");
                }
            })
            .catch(error => console.error(error));
    }

    otoDuyuru();
    setInterval(otoDuyuru, 5*60*1000);
    client.user.setActivity("Thorakna'yı", { type: 2 });
});

client.on('message', async message => {
    var gelen_msg = message.content.toLowerCase();
    if (gelen_msg === prefix + "hakkinda") {
        message.channel.send('Manisa Celal Bayar Üniversitesi öğrencilerinin kurduğu discord sunucuları için Thorakna tarafından geliştirilen bir discord botudur.');
        console.log('Bir soruya cevap verildi!! [cbu-bot-nedir]');
    } else if (gelen_msg === prefix + 'sonduyuru') {
        var duyurular = await duyuruCek();
        if (!Array.isArray(duyurular)) {
            message.channel.send("Hata: " + duyurular);
        } else {
            const Embed = new Discord.MessageEmbed()
                .setColor([22, 191, 217])
                .setTitle(duyurular[0].title)
                .setDescription(duyurular[0].url)
                .setFooter(duyurular[0].date);

            message.channel.send(Embed);
            message.react('👌');
        }
    } else if (gelen_msg === prefix + 'duyurular') {
        var duyurular = await duyuruCek();
        if (!Array.isArray(duyurular)) {
            message.channel.send("Hata: " + duyurular);
        } else {
            var duyuruString = "";
            for (var i = 0; i < 15; i++) {
                duyuruString += duyurular[i].title + "\n";
                duyuruString += duyurular[i].url + "\n\n";
            }
            const Embed = new Discord.MessageEmbed()
                .setColor([22, 191, 217])
                .setTitle("Son 15 Duyuru")
                .setDescription(duyuruString)
                .setFooter("Veriler bilgisayarmuh.mcbu.edu.tr adresinden alınmıştır.");
            message.channel.send(Embed);
            message.react('👌');
        }
    } else if (gelen_msg === prefix + 'otoduyuru') {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            message.channel
              .send(
                ":warning: - Bu komutu kullanabilmek için yetkiniz yok.",
              );
        }else{
            var channelId = message.channel.id;
            jsonfile.readFile(dataFile)
                .then(obj => {
                    if (obj.kanallar.indexOf(channelId) < 0) {
                        obj.kanallar.push(channelId);
                        jsonfile.writeFile(dataFile, obj, function (err) {
                            if (err) console.error(err)
                        });
                        message.channel.send("Yeni duyurular artık bu kanalda otomatik yayınlanacak.");
                    } else {
                        message.channel.send("Zaten bu kanalda otomatik duyuru yapılıyor.");
                    }
                })
                .catch(error => console.error(error));
        }
    } else if (gelen_msg === prefix + 'otoduyuruiptal') {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            message.channel
              .send(
                ":warning: - Bu komutu kullanabilmek için yetkiniz yok.",
              );
        }else{
            var channelId = message.channel.id;
            jsonfile.readFile(dataFile)
                .then(obj => {
                    if (obj.kanallar.indexOf(channelId) < 0) {
                        message.channel.send("Zaten bu kanalda otomatik duyuru yapılmıyor.");
                    } else {
                        obj.kanallar = kanalSil(obj.kanallar, channelId);
                        jsonfile.writeFile(dataFile, obj, function (err) {
                            if (err) console.error(err)
                        });
                        message.channel.send("Artık bu kanalda otomatik duyuru yapılmayacak.");
                    }
                })
                .catch(error => console.error(error));
        }
    }
});

client.login(process.env.API_KEY);
