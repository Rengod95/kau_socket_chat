import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const RouteMapper = {
  chat: {
    path: "/chat",
    element: () => import("./pages/ChatPage"),
  },
  entry: {
    path: "/",
    element: () => import("./pages/EntryPage"),
  },
};

const Chat = React.lazy(RouteMapper.chat.element);
const Entry = React.lazy(RouteMapper.entry.element);

const Router = () => {
  return (
    <>
      <Routes>
        <Route path={RouteMapper.chat.path} element={<Chat />}></Route>
        <Route path={RouteMapper.entry.path} element={<Entry />}></Route>
      </Routes>
    </>
  );
};

export default Router;
