import React, { useRef } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../states/user.state";
import { ChatPageContainer } from "./ChatPage";
import { Button } from "@mui/material";
import {
  ChatInput,
  ChatInputContainer,
  ChatInputWrapper,
} from "../components/ChatContainer";
import { useNavigate, useNavigation } from "react-router-dom";
import styled from "@emotion/styled";

export const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 24rem;
  height: 16rem;
  z-index: 2;
  box-sizing: border-box;
  padding: 1.6rem;
  border-radius: 1rem;
  box-shadow: 0 0 8rem 0 rgba(0, 0, 0, 0.1),
    0rem 2rem 4rem -3rem rgba(0, 0, 0, 0.5);
  background: #fff;

  & h1 {
    width: 100%;
    text-align: center;
    font-weight: 800;
    font-size: 2.5rem;
  }
`;

const EntryPage = () => {
  const [user, setUser] = useRecoilState(userState);
  const inputRef = useRef();
  const navigator = useNavigate();

  const handleSubmitName = (e) => {
    if (inputRef.current) {
      if (inputRef.current.value.length !== 0) {
        setUser({
          name: inputRef.current.value,
        });
        navigator("/chat");
      }
    }
  };
  return (
    <ChatPageContainer>
      <Root>
        <h1>닉네임 설정</h1>
        <ChatInputContainer>
          <ChatInputWrapper>
            <ChatInput ref={inputRef} type={"text"} />
            <Button onClick={handleSubmitName} sx={{ background: "#000" }}>
              확인
            </Button>
          </ChatInputWrapper>
        </ChatInputContainer>
      </Root>
    </ChatPageContainer>
  );
};

export default EntryPage;
