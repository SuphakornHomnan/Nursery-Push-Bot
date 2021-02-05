const express = require('express')

const app = express()
const fs = require('fs')
const shell = require('shelljs')

const { checkDay } = require('./helpers/date')
const { getAttendNotification } = require('./helpers/getNotice')

require('dotenv').config()
require('./models/mongo')

async function writeShellFile (dateNow, message) {
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

  //   console.log(typeof users);
  //   console.log(`${users}`);
  //   console.log(message.attend);
  //   console.log(dateNow);

  try {
    fs.writeFileSync(
      './test.sh',
      `curl -H 'Content-Type: application/json' -H 'Authorization: Bearer {${process.env.TOKEN}}' -X POST -d '{
          "to": [${users}],
          "messages":[
            
            {
              "type":"text",
              "text":"ตอนนี้เวลา ${dateNow}"
            },

            {
              "type":"text",
              "text":"น้อง${message.attend}"
            }
            
          ]
        }' https://api.line.me/v2/bot/message/multicast`,
      (err) => {
        if (err) {
          console.log('error at write_file_func')
          throw err
        }

        console.log('Saved')
      }
    )
  } catch (err) {
    console.log('error begun')
    console.log(err)
  }
}

;(() => {
  const SECOND = 1000
  const MINUTE = SECOND * 60
  const HOUR = MINUTE * 60
  const DAY = HOUR * 24

  function sendMessage () {
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
    console.log(dateNow)
    if (triggerDate && dateNow === '10:30') {
      fs.writeFileSync(
        './test.sh',
        `curl -H 'Content-Type: application/json' -H 'Authorization: Bearer {${process.env.TOKEN}}' -X POST -d '{
            "to": ["Uaf3e8e05760c1392233f0aaa85f83b87"],
            "messages":[
              {
                "type":"text",
                "text":"ตื่นได้แล้วไนซ์"
              },
              {
                "type":"text",
                "text": "ตอนนี้เวลา ${dateNow}"
              }
              
            ]
          }' https://api.line.me/v2/bot/message/multicast`,
        (err) => {
          if (err) {
            console.log('error at write_file_func')
            throw err
          }
          console.log('Saved')
        }
      )
      shell.exec('chmod +x ./test.sh')
      shell.exec('./test.sh')
      // getAttendNotification().then((result) => {
      //   //   console.log(result);
      //   if (result._id.length > 0) {
      //     writeShellFile(dateNow, result)

      //     shell.exec('chmod +x ./test.sh')
      //     shell.exec('./test.sh')
      //   } else {
      //     //Don't send msg to guardians
      //     console.log(`today don't have child absent`)
      //   }
      // })
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
