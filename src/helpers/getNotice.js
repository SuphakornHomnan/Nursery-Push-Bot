const attendances = require('../models/attendance')
const guardians = require('../models/guardian')

const moment = require('moment')

exports.getAttendNotification = async () => {
  const absentToday = await attendances.find({
    date: moment().format('YYYY-MM-DD') + 'T00:00:00.000+00:00',
    attend: false
  })
  console.log('absentToday')
  console.log(absentToday)
  const info = []
  for (let i = 0; i < absentToday.length; i++) {
    const guardianInfo = await guardians.find({ child: absentToday[i].child })
    console.log(guardianInfo)
    for (let j = 0; j < guardianInfo.length; j++) {
      if (guardianInfo[j].line_id === undefined) {
        // Nothing
      } else {
        info.push(guardianInfo[j].line_id)
      }
    }
  }
  console.log(absentToday)
  console.log(info)
  return {
    _id: info,
    attend: 'ไม่มาเรียนวันนี้นะครับ'
  }
}
