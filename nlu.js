const TelegrafWit = require('telegraf-wit')
const Promise = require('bluebird')


const wit = new TelegrafWit('SPLJWKL5XOGTAVYDSXIBLIG3KLDRV3G6')

module.exports = (message) => {
    return new Promise((resolve, reject) => {
        wit.meaning(message.text).then(result => {
            console.log(result.entities.intent[0])
            message.nlu = result
            resolve(message)
        })
    })
}