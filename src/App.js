import Router from "./Router";
import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const Root = styled(Box)`
  width: 100vw;
  height: 100vh;

  & * {
    box-sizing: border-box;
    text-decoration: none;
    font-size: 10px;
  }
`;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Root as={"div"} className={"App"}>
        <Suspense fallback={<div>로딩중...</div>}>
          <RecoilRoot>
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </RecoilRoot>
        </Suspense>
      </Root>
    </QueryClientProvider>
  );
}

export default App;
