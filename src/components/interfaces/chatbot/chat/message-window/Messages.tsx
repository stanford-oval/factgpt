import React, { useRef, useEffect } from "react";
import Message from "./Message";
import MicrophoneInfo from "./initial-messages/MicrophoneInfo";

export default function Messages({ history, convoState, messagesBottom }: any) {
  let audioRef = useRef();

  audioRef.current = convoState.value.audio;

  useEffect(() => {
    // if (history.value.length > 0) return; // only run this on first render
    history.value[0] = {
      id: -3,
      fromChatbot: true,
      show: true,
      component: <MicrophoneInfo />,
      read: "You can tap on the microphone button to start speaking. When you're done talking, click it again. Click the audio button to hear my replies"
    };
    history.value[1] = {
      id: -4,
      fromChatbot: true,
      show: true,
      text: "Hi there, I am a virtual assistant for health survey. Shall we get started?",
    };
    convoState.setValue((cs: any) => ({ ...cs, turn: "user-answer" }));
  }, []);

  // scrolling
  useEffect(() => {
    setTimeout(() => {
      if (messagesBottom.current) {
        if (
          history.value
            .slice(0, Math.min(history.value.length, 10))
            .filter((h: any) => !h.fromChatbot).length > 0
        )
          messagesBottom.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
      }
    }, 200);
  }, [history.value]);

  return (
    <div
      className="bg-white border-x-2 border-t-2 border-gray-400 p-2 overflow-y-auto pretty-scroll h-full"
      id={convoState.value.turn.includes("eval") || convoState.value.turn.includes("select") ? "small-chat-window" : "chat-window"}
    >
      <ul>
        {history.value.map((message: any) => (
          <Message message={message} audioRef={audioRef} convoState={convoState} key={message.id} />
        ))}
        {(!convoState.value.turn.startsWith("user") && !convoState.value.turn.includes("read")) && (
          // show loading animation
          <div className="rounded-3xl w-fit px-5 py-3 mx-2 mt-1.5 max-w-xs break-words bg-gray-200 mr-auto">
            <div className="px-3 py-1">
              <div className="snippet" data-title=".dot-flashing">
                <div className="stage">
                  <div className="dot-flashing" />
                </div>
              </div>
            </div>
          </div>
        )}
      </ul>
      <div className="-mb-20 invisible text-xs" ref={messagesBottom}>
        .
      </div>
    </div>
  );
}
