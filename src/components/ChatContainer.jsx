import styled from "@emotion/styled";
import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { io } from "socket.io-client";
import { userState } from "../states/user.state";
import { getRandomHex } from "../util/Number";
import ChatBubble from "./ChatBubble";


export const RootContainer = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 24rem;
  height: 38rem;
  z-index: 2;
  box-sizing: border-box;
  border-radius: 1rem;
  box-shadow: 0 0 8rem 0 rgba(0, 0, 0, 0.1),
    0rem 2rem 4rem -3rem rgba(0, 0, 0, 0.5);
  background: #fff;
`;

export const ChatHeader = styled.header`
  flex-basis: 3.5rem;
  flex-shrink: 0;
  box-sizing: border-box;
  height: 7rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  justify-content: center;
`;

export const HeaderTextWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0.4rem 1.2rem;
  box-sizing: border-box;
  font-size: 1.6rem;
`;

export const ChatBody = styled.article`
  padding: 1rem;
  height: 100%;
  background: #f7f7f7;
  flex-shrink: 2;
  overflow-y: auto;
  box-shadow: inset 0 2rem 2rem -2rem rgba(0, 0, 0, 0.05),
    inset 0 -2rem 2rem -2rem rgba(0, 0, 0, 0.05);
`;

export const ChatFooter = styled.footer`
  box-sizing: border-box;
  flex-basis: 4rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 0.5rem 0 1.5rem;
`;

export const ChatInputContainer = styled.div`
  width: 100%;
  height: auto;
  box-sizing: border-box;
`;

export const ChatInputWrapper = styled.form`
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ChatInput = styled.input`
  border: none;
  background-image: none;
  background-color: white;
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  border-radius: 1.125rem;
  flex-grow: 2;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1),
    0rem 1rem 1rem -1rem rgba(0, 0, 0, 0.2);
  font-family: Red hat Display, sans-serif;
  letter-spacing: 0.025em;
  font-size: 14px;
  font-weight: 700;
`;

export const DEFAULT_CHAT_DATA = [
  {
    name: "항공대학교",
    content: "채팅방에 입장하셨습니다.",
  },
];

const ChatContainer = ({ children }) => {
  const [isEntered, setIsEntered] = useState(false);
  const [chat, setChat] = useState(DEFAULT_CHAT_DATA);
  const [user, setUser] = useRecoilState(userState);
  const inputRef = useRef(null);
  const socketRef = useRef(null);
  const navigator = useNavigate();


  useEffect(() => {
    console.log(process.env.CHAT_PATH);
    socketRef.current = io.connect("https://networksocket.shop/");
    const userEnterMessage = {
      name: `${user.name}님`,
      content: "입장하셨습니다.",
    };
  
    // 서버로 입장 메시지 전송
    socketRef.current.emit("chat", userEnterMessage);
  
    // 클라이언트에 입장 메시지 추가
    setChat((prev) => [...prev, userEnterMessage]);
  
    socketRef.current.on("chat", ({ name, content }) => {
      if (name !== user.name) {
        setChat((prev) => [...prev, { name, content }]);
      }
    });
  
    return () => {
      const userExitMessage = {
        name: `${user.name}님`,
        content: "퇴장하셨습니다.",
      };
  
      // 서버로 퇴장 메시지 전송
      socketRef.current.emit("chat", userExitMessage);
  
      // 클라이언트에 퇴장 메시지 추가
      setChat((prev) => [...prev, userExitMessage]);
  
      socketRef.current.disconnect();
    };
  }, []);
  

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (inputRef.current) {
      if (socketRef.current) {
        socketRef.current.emit("chat", {
          name: user.name,
          content: inputRef.current.value,
        });
        setChat((prev) => {
          return [
            ...prev,
            { name: user.name, content: inputRef.current.value },
          ];
        });
      }
      console.log(inputRef.current.value);
      resetInputValue();
    }
  };

  const handleEnter = (e) => {
    if (!isEntered && e.key === "Enter") {
      e.preventDefault();
      handleChatSubmit();
      resetInputValue();
    }
  };

  const resetInputValue = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  const handleLogout = () => {
    // 클라이언트에서 로그아웃 버튼을 클릭할 때의 동작을 구현합니다.
    // 예를 들어, 사용자 상태를 초기화하고 로그인 페이지로 이동하는 등의 작업을 수행할 수 있습니다.
    setChat((prev) => {
      return [
        ...prev,
        { name: `user.name`, content:"님이 나갔습니다." },
      ];
    });


    setUser({name:''}); // 사용자 상태 초기화
    navigator('/'); // 로그인 페이지로 이동
  };
  
  return (
    <RootContainer>
      <ChatHeader>
        <HeaderTextWrapper>KAU-CHAT  <Button id="leaveButton" onClick={handleLogout}>나가기</Button></HeaderTextWrapper>
      </ChatHeader>
      <ChatBody>
        {chat.map((data) => {
          return (
            <ChatBubble
              id={getRandomHex()}
              name={data.name}
              content={data.content}
            />
          );
        })}
      </ChatBody>
      <ChatFooter>
        <ChatInputContainer>
          
          <ChatInputWrapper onKeyDown={handleEnter}>
            <ChatInput multiline maxRows={5} ref={inputRef}></ChatInput>
            <Button onClick={handleChatSubmit}>전송</Button>
            
          </ChatInputWrapper>
        </ChatInputContainer>
      </ChatFooter>
    </RootContainer>
  );
};

export default ChatContainer;
