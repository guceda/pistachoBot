var express = require('express');
var router = express.Router();

const Telegraf = require('telegraf')
const expressApp = express()
const bot = new Telegraf('600500573:AAFsMMOmXmf6LQ2R7VJXJJrU9xOQS1BPhJ0')

var request = require('request')


expressApp.use(bot.webhookCallback('/secret-path'))
bot.telegram.setWebhook('https://70c95db4.ngrok.io/secret-path')

expressApp.post('/secret-path', (req, res) => {
  res.json(res)
})
expressApp.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})


bot.start((ctx) => ctx.reply('Hola soy Pistacho'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('Hola', (ctx) => ctx.reply('Hola como estas?'))
bot.command('/creators', ({ reply }) => reply('Los creadores son: Gon, Alex, Ignacio y Jorge'))
bot.command('/help', ({ reply }) => reply('mis comandos son: /help /creators /weather /whereami '))
bot.command('/weather', (ctx) => getWeather(ctx))
bot.command('/whereami', (ctx) => getLocation(ctx))


function getWeather(ctx) {
  let numLetras = ctx.update.message.text.indexOf(" ") + 1
  if (numLetras === 0) {
    ctx.reply('Necesitas especificar una ciudad')
  } else {
    this.ciudad = ctx.update.message.text.substring(numLetras)
    request(`http://api.openweathermap.org/data/2.5/weather?q=${this.ciudad}&APPID=862c88af70795c6aaf3da4dceb93eff2&units=metric&lang=es`, function (error, response, body) {
      let tiempo = JSON.parse(body)
      let cielo = tiempo.weather[0].description
      let tempMax = tiempo.main.temp_max
      let tempMin = tiempo.main.temp_min

      bot.telegram.sendMessage(ctx.from.id, `
      Este es el tiempo:
      Asi está el cielo en tu ciudad: ${cielo}
      Esta es la temperatura minima: ${tempMin}
      Esta es la temperatura máxima: ${tempMax}`)
    })
  }
}

function getLocation(ctx){
  let numLetras = ctx.update.message.text.indexOf(" ") + 1
  if (numLetras === 0) {
    ctx.reply('Necesitas especificar una dirección')
  } else {
    this.direccion = ctx.update.message.text.substring(numLetras)
    request(`https://geocode.xyz/${this.direccion}?json=1&auth=811262385804386629444x611`, function (error, response, body) {
      let address = JSON.parse(body)
      let long = address.longt
      let lat = address.latt
      console.log(lat)
    
      bot.telegram.sendMessage(ctx.from.id, `
      Tus coordenadas:
      Esta es tu latitud: ${lat}
      Esta es tu longitud: ${long}`)
    })

      bot.telegram.sendPhoto(ctx.from.id, `https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=18&size=600x300&maptype=roadmap
      &markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318
      &markers=color:red%7Clabel:C%7C40.718217,-73.998284
      &key=AIzaSyBVCGUdYG9Oky4IUkC25tFOiaDIF41rkDk`)


  }
}






module.exports = router;
