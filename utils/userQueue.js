const Queue = require('bull');
const userQueue = new Queue('userQueue');

module.exports = userQueue;
