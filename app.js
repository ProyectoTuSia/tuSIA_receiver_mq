const amqp = require('amqplib/callback_api');
const axios = require('axios')
const scheduleURL = 'http://35.222.42.133:8000'


amqp.connect('amqp://35.223.72.88:5672', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'createScheduleQueue';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        // let jsonSchedule = {
        // }

        channel.consume(queue, async function(schedule) {
            console.log(schedule.content.toString())

            const jsonSchedule = JSON.parse(schedule.content.toString())
            console.log(jsonSchedule)
             const scheduleResponse = await axios.put(`${scheduleURL}/consulta_horario/${jsonSchedule.userId}`, jsonSchedule)
             console.log(scheduleResponse)
            console.log("[x] Received %s", schedule.content.toString());
        }, {
            noAck: true
        });
    });
});