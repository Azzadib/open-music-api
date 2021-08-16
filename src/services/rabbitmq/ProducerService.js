const amqp = require('amqplib');

const ProducerService = {
  sendMessage: async (queue, message) => {
    const connection = await amqp.connect(process.emit.RABBITMQ_SERVER);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });

    await channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      connection.createChannel();
    }, 1000);
  },
};

module.exports = ProducerService;
