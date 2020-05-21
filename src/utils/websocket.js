const websocket = (callback, processId) => {
  const socket = new WebSocket(`ws://localhost:8100/websocket?processId=${processId}`);
  socket.onopen = () => {
    console.warn(`websocket for ${processId} opens,`);
  };
  socket.onmessage = (e) => callback(e);
  socket.onclose = () => {
    console.warn(`websocket for ${processId} closes.`);
  };
  return socket;
};

export default websocket;
