const express = require('express')

const app = express()
const fs = require('fs')
const shell = require('shelljs')

const { checkDay } = require('./helpers/date')
const { getAttendNotification } = require('./helpers/getNotice')

require('dotenv').config()
require('./models/mongo')

async function writeShellFile (message) {
  let users = ''

  message._id.forEach((element, index) => {
    users = users.concat('"')
    users = users.concat(element)

    if (message._id.length - 1 === index) {
      users = users.concat('"')
    } else {
      users = users.concat('",')
    }
  })

  try {
    if (users === '') {
      // Do nothing
    } else {
      fs.writeFileSync(
        './test.sh',
        `curl -H 'Content-Type: application/json' -H 'Authorization: Bearer {${process.env.TOKEN}}' -X POST -d '{
            "to": [${users}],
            "messages":[{
                "type":"text",
                "text":"น้อง${message.attend}"
              }]
          }' https://api.line.me/v2/bot/message/multicast`,
        (err) => {
          if (err) {
            console.log('error at write_file_func')
            throw err
          }

          console.log('Saved')
        }
      )
    }
  } catch (err) {
    console.log(err)
  }
}

;(() => {
  const SECOND = 1000
  const MINUTE = SECOND * 60
  const HOUR = MINUTE * 60
  const DAY = HOUR * 24

  async function sendMessage () {
    const today = new Date()

    const todayString = today.toString()
    const todaySplit = todayString.split(' ')
    const triggerDate = checkDay(todaySplit[0])

    const time = today.getTime()
    let hoursCount = Math.floor((time % DAY) / HOUR)
    const minuteCount = Math.floor((time % HOUR) / MINUTE)

    // timezone
    hoursCount += 7

    if (hoursCount > 23) {
      hoursCount = hoursCount - 24
    }
    const dateNow = `${hoursCount}:${minuteCount}`
    if (dateNow === '12:0') {
      try {
        const test = await getAttendNotification()
        writeShellFile(test)
        if (test._id.length === 0) {
          console.log('Do nothing')
        } else {
          shell.exec('chmod +x ./test.sh')
          shell.exec('./test.sh')
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      // Do nothing
    }
  }

  function run () {
    setInterval(() => {
      sendMessage()
    }, MINUTE)
  }
  run()
})()

app.get('/', (req, res) => res.json({ greeting: 'Hi nice!!' }))

app.listen(process.env.PORT, () => {
  console.log('Now service is launching.')
})
