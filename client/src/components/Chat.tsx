import { Message } from "../App";
import Input from "./UI/Input";

type Props = {
  chatHistory: Array<Message>;
  onButtonPress: (userInput: string) => void;
  isUser: boolean;
};

export default function Chat({ chatHistory, onButtonPress, isUser }: Props) {
  return (
    <>
      <div className="flex-1 border-2 rounded-md border-indigo-400 flex flex-col p-2 gap-2 overflow-y-scroll">
        {chatHistory?.map((msg, index) => (
          <div
            className="flex flex-col border bg-indigo-800 rounded"
            key={"msg:" + index}
          >
            <p>{msg.username}</p>
            <p>{msg.message}</p>
            <p>{new Date(msg.time).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <Input
        buttonText={isUser ? "Send" : "Choose Username"}
        placeholder={
          isUser ? "Start typing your message..." : "Type in your username"
        }
        onButtonPress={onButtonPress}
      />
    </>
  );
}
