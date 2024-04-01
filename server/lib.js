const fs = require('node:fs/promises');
const PATH_TO_MESSAGES = './messages.json';
const { v4: uuidv4 } = require('uuid');


// ************************* private ************************* //
const readFile = async () => {
  const data = await fs.readFile(PATH_TO_MESSAGES, "utf-8");
  const parsed = JSON.parse(data);
  return parsed;
}

const writeFile = async (newContent) => {
  await fs.writeFile(PATH_TO_MESSAGES, newContent);
}

// ************************* exported ************************* //
const readAllMessages = async () => {
  return await readFile();
}
const writeNewMessage = async (message) => {
  if (!message) {
    return;
  }

  const allMessages = await readFile();
  allMessages.push(message);
  const newContent = JSON.stringify(allMessages);
  writeFile(newContent);
}

const getRandomUUID = () => {
  return uuidv4();
}

module.exports = { readAllMessages, writeNewMessage, getRandomUUID }
