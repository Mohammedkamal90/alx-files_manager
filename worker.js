const amqp = require('amqplib');

async function main() {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Declare queue
    const queue = 'task_queue';
    await channel.assertQueue(queue, { durable: true });

    console.log("Worker is waiting for messages...");

    // Consume messages from the queue
    channel.consume(queue, async (msg) => {
      const message = msg.content.toString();
      console.log("Received message:", message);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 5000));

      console.log("Message processed.");

      // Acknowledge message
      channel.ack(msg);
    });
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
