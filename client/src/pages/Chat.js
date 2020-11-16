import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, Typography } from '@material-ui/core';
import socketIOClient from "socket.io-client";
import { withStyles } from '@material-ui/core/styles';

const Endpoint = process.env.WS_URL || "http://127.0.0.1:3001";

const styles = theme => ({
});

const user = "Bonnie";
const id = "foobar";

const Chat = withStyles(styles)(({ classes, }) => {
  const [chat, setChat] = useState("");
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);

  const send = () => {
    if (socket === null) {
      console.log("socket is empty, not sending");
      return ;
    }
    console.log(`Sending ${message} from ${user} on ${socket.id}`);
    setChat(`${chat}\n${user} - ${message}\n`);
    socket.emit("chat", id, user, message);
    setMessage("");
  };

  const onClick = e => {
    e.preventDefault();
    send();
  }

  const onEnter = e => {
    e.preventDefault();
    if (e.key === "Enter") {
      setChat(c => `${c}\n${user} - ${message}\n`);
      send();
    }
    setMessage(`${message}${e.key}`);
  };

  useEffect(() => {
    const sock = socketIOClient(Endpoint);
    console.log(`Connected to endpoint: ${Endpoint}`);
    setSocket(sock);

    sock.emit("join", id);

    sock.on("chat", (user, message) => {
      setChat(c => `${c}\n${user} - ${message}\n`);
    });

    return () => {
      console.log(`Disconnected from web socket: ${sock.id}`);
      sock.disconnect();
    };
  }, []);

  return (
    <Grid container justify="flex-end">
      <Grid item xs={12}>
        <Typography>{ chat }</Typography>
      </Grid>
      <Grid container item xs={12}>
        <TextField
          fullWidth
          multiline
          variant="outlined"
          placeholder="Enter your message here."
          onKeyDown={onEnter}
          value={message}
          InputProps={{
            endAdornment: (
              <Button
                onClick={onClick}
                variant="outlined">
                Send
              </Button>
            )
        }}/>
      </Grid>
    </Grid>
  );
});

export default Chat;
