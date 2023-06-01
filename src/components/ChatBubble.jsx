import React from "react";
import styled from "@emotion/styled";
import { Box, Container } from "@mui/material";
import { useRecoilState } from "recoil";
import { userState } from "../states/user.state";

export const BubbleContainer = styled(Container)`
  display: flex;
  justify-content: ${({ isSame }) => (isSame ? "flex-end" : "flex-start")};
  min-height: 2.25rem;
  box-sizing: border-box;
  width: fit-content;
  padding: 0.5rem 1rem;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.075),
    0rem 1rem 1rem -1rem rgba(0, 0, 0, 0.1);
  max-width: 66%;
  margin: 1rem;
  ${({ isSame }) => {
    if (isSame) {
      return `
        margin: 1rem 1rem 1rem auto;
        border-radius: 1.125rem 1.125rem 0rem 1.125rem;
        background: #333;
        color: white;
      `;
    }
    return `
      background: #FFF;
      border-radius: 1.125rem 1.125rem 1.125rem 0;
    `;
  }};
`;

export const Bubble = ({ name, content }) => {
  return (
    <Box
      as="div"
      sx={{
        display: "flex",
        justifyContent: "Center",
        alignItems: "center",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <Box
        as={"span"}
        sx={{ width: "100%", fontWeight: 700, fontSize: "16px" }}
      >
        {name}
      </Box>
      <Box>{content}</Box>
    </Box>
  );
};

const ChatBubble = ({ id, name, content }) => {
  const [user, setUser] = useRecoilState(userState);

  return (
    <BubbleContainer isSame={user.name === name}>
      <Bubble name={name} content={content} />
    </BubbleContainer>
  );
};

export default ChatBubble;
