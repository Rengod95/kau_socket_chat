import React, { useRef } from "react";
import ChatContainer, {
  ChatInput,
  ChatInputContainer,
  ChatInputWrapper,
} from "../components/ChatContainer";
import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { useRecoilState } from "recoil";
import { userState } from "../states/user.state";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../App";

export const ChatPageContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-around;
  align-items: center;
  background: #adf171;
`;

export const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 24rem;
  height: 38rem;
  z-index: 2;
  box-sizing: border-box;
  border-radius: 1rem;
  box-shadow: 0 0 8rem 0 rgba(0, 0, 0, 0.1),
    0rem 2rem 4rem -3rem rgba(0, 0, 0, 0.5);
  background: #fff;
`;

export const CardHeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 1rem 1rem 1rem;
  flex-basis: 3.5rem;
  flex-shrink: 0;
  & h1 {
    width: 100%;
    text-align: center;
    font-weight: 800;
    font-size: 2.5rem;
  }
`;

export const CardBody = styled.div`
  padding: 1rem;
  height: 100%;
  background: #f7f7f7;
  flex-shrink: 2;
  overflow-y: auto;
  box-shadow: inset 0 2rem 2rem -2rem rgba(0, 0, 0, 0.05),
    inset 0 -2rem 2rem -2rem rgba(0, 0, 0, 0.05);
`;

export const CardRoot = styled.div`
  display: flex;
  width: 100%;
  min-height: 5rem;
  margin-top: 1rem;
  justify-content: center;
  align-items: flex-start;

  flex-direction: column;
  z-index: 2;
  box-sizing: border-box;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.075),
    0rem 1rem 1rem -1rem rgba(0, 0, 0, 0.1);
  background: #f8f8f8;

  & h2 {
    font-size: 18px;
    font-weight: 700;
  }

  & span {
    font-size: 14px;
    font-weight: 500;
    height: 100%;
  }
`;

export const GET_ALL_CARD_SERVER_URL = "https://networksocket.shop/board/all";
export const CREATE_NEW_CARD_SERVER_URL = "https://networksocket.shop/board";
export const BOARD_QUERY_KEY = "board";

export const useCreateCardQuery = () => {
  const { mutate } = useMutation({
    mutationKey: ["createBoard"],
    mutationFn: async ({ title, content }) => {
      console.log(title, content);
      const result = await fetch(CREATE_NEW_CARD_SERVER_URL, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      }).then((res) => res.json());
      return result;
    },
    onSuccess: async () => {
      console.log("as");
      await queryClient.invalidateQueries([BOARD_QUERY_KEY], {
        refetchType: "all",
      });
    },
    onError: () => {
      console.log("error");
    },
  });

  return mutate;
};
export const getAllCard = async () => {
  const res = fetch(GET_ALL_CARD_SERVER_URL, {
    method: "get",
  }).then((res) => res.json());
  return res;
};

const ChatPage = () => {
  const [user, setUser] = useRecoilState(userState);
  const inputRef = useRef();
  const navigator = useNavigate();
  const { data, status } = useQuery({
    queryKey: [BOARD_QUERY_KEY],
    queryFn: () => getAllCard(),
    staleTime: 0,
    cacheTime: 0,
  });
  const createCard = useCreateCardQuery();

  const handleSubmitName = (e) => {
    if (inputRef.current) {
      createCard({ title: user.name, content: inputRef.current.value });
    }
  };
  return (
    <ChatPageContainer>
      <ChatContainer></ChatContainer>

      <CardContainer>
        <CardHeaderWrapper>
          <h1>방명록</h1>
          <ChatInputContainer>
            <ChatInputWrapper>
              <ChatInput ref={inputRef} type={"text"} />
              <Button onClick={handleSubmitName} sx={{ background: "#000" }}>
                확인
              </Button>
            </ChatInputWrapper>
          </ChatInputContainer>
        </CardHeaderWrapper>
        <CardBody>
          {status === "loading" && <div>데이터 로딩중...</div>}
          {status === "error" && <div>데이터 패칭 중 에러발생</div>}
          {status === "success" &&
            data &&
            data.map((board) => {
              return (
                <CardRoot>
                  <h2>{board.title}</h2>
                  <span>{board.content}</span>
                </CardRoot>
              );
            })}
        </CardBody>
      </CardContainer>
    </ChatPageContainer>
  );
};

export default ChatPage;
