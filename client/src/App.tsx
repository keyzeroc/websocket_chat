import { useEffect, useState } from "react";
import Chat from "./components/Chat";
import { v4 as uuidv4 } from "uuid";

export interface Message {
  id: string;
  username: string;
  message: string;
  time: string;
}

const ws = new WebSocket("ws://localhost:8080", "echo-protocol");

function App() {
  const [chatHistory, setChatHistory] = useState<Array<Message>>([]);
  const [username, setUserName] = useState<string>("");

  useEffect(() => {
    ws.onmessage = (message) => {
      const response = JSON.parse(message.data);

      if (response.method === "connect") {
        if (response.messages.length !== chatHistory?.length) {
          setChatHistory(response.messages);
        }
      }

      if (response.method === "newMessage") {
        const { message } = response;
        console.log(message);
        if (message.username === username) return;
        setChatHistory((prevChatHistory) => [
          ...(prevChatHistory as Message[]),
          message,
        ]);
      }
    };
  }, []);

  const sendMessageHandler = (userInput: string) => {
    if (ws.readyState !== 1 || username === "") {
      return;
    }
    const newMessage: Message = {
      id: uuidv4(),
      username,
      message: userInput,
      time: new Date().toISOString(),
    };
    const payload = {
      method: "sendMessage",
      message: newMessage,
    };

    ws.send(JSON.stringify(payload));

    setChatHistory((prevChatHistory) => {
      return [...(prevChatHistory as Message[]), newMessage];
    });
  };

  const chooseUsernameHandler = (userInput: string) => {
    if (ws.readyState !== 1) {
      return;
    }
    const payload = {
      method: "chooseUsername",
      username: userInput,
    };
    ws.send(JSON.stringify(payload));

    setUserName(userInput as string);
  };

  return (
    <div className="min-h-full h-full bg-indigo-900 w-full text-gray-200 flex flex-col p-4 gap-4">
      <Chat
        chatHistory={chatHistory as Message[]}
        onButtonPress={
          username === "" ? chooseUsernameHandler : sendMessageHandler
        }
        isUser={username !== ""}
      />
    </div>
  );
}

export default App;
