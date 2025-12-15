import { io } from "socket.io-client";

const SOCKET_URL = "https://hiring-dev.internal.kloudspot.com";

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});
