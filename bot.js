var express = require('express');
var router = express.Router();

const Telegraf = require('telegraf')
const expressApp = express()
const bot = new Telegraf('600500573:AAFsMMOmXmf6LQ2R7VJXJJrU9xOQS1BPhJ0')

var request = require('request')
const nlu = require('./nlu')
const dialog = require('./dialog')


expressApp.use(bot.webhookCallback('/secret-path'))
bot.telegram.setWebhook('https://70c95db4.ngrok.io/secret-path')

expressApp.post('/secret-path', (req, res) => {
  res.json(res)
})
expressApp.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})


bot.start((ctx) => ctx.reply('Hola soy Pistacho'))
bot.hears('Hola', (ctx) => ctx.reply('Hola como estas?'))
bot.command('/creators', ({ reply }) => reply('Los creadores son: Gon, Alex, Ignacio y Jorge'))
bot.command('/help', ({ reply }) => reply('mis comandos son: /help /creators /weather /whereami '))
bot.command('/weather', (ctx) => getWeather(ctx))
bot.command('/whereami', (ctx) => getLocation(ctx))
// bot.on('text', (ctx) => defineNaturalLanguage(ctx))


//tiempo 
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


//localización 
function getLocation(ctx){
  let numLetras = ctx.update.message.text.indexOf(" ") + 1
  if (numLetras === 0) {
    ctx.reply('Necesitas especificar una dirección')
  } else {
    this.direccion = ctx.update.message.text.substring(numLetras)
    request(`https://geocode.xyz/${this.direccion}?json=1&auth=563596222602632127436x613`, function (error, response, body) {
      let address = JSON.parse(body)
      let long = address.longt
      let lat = address.latt
    
      bot.telegram.sendMessage(ctx.from.id, `
      Tus coordenadas:
      Esta es tu latitud: ${lat}
      Esta es tu longitud: ${long}`)

      bot.telegram.sendPhoto(ctx.from.id, `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${long}&markers=color:blue%7Clabel:A%7C${lat},${long}&zoom=18&size=400x200&key=AIzaSyAtEPBMH-ayWiHs0wml45NVA_iQPLoq90g`)


    })

  }
}


//al pasar dialog como parámetro ejecutamos la funcion dialog, ya que recibe el mismo parámetro que nlu
bot.on('text', (ctx) => {
  nlu(ctx.message).then(dialog).then((value)=>{
    bot.telegram.sendMessage(ctx.from.id, value)
  })
 
})







module.exports = router;
