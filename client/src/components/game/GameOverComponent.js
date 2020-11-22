import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Modal, Backdrop, Fade, Typography } from "@material-ui/core";

import Skull from "../../assets/filename.svg";

const useStyles = makeStyles((theme) => ({
  formButton: {
    display: "flex",
    margin: "24px auto 32px",
    textTransform: "none",
    backgroundColor: "#32BE72",
    color: "white",
    width: "120px",
    height: "40px",
  },
  endGameModal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  endGameContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "10px",
    boxShadow: "0 0 10px 0",
    padding: theme.spacing(5, 20, 0),
    backgroundColor: "white",
  },
}));

const GameOverComponent = (props) => {
  const classes = useStyles();
  const {
    endGameModalOpen,
    setEndGameModalOpen,
    redPoints,
    bluePoints,
    winner,
  } = props;

  return (
    <Modal
      className={classes.endGameModal}
      open={endGameModalOpen}
      onClose={() => {
        setEndGameModalOpen(false);
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade className={classes.endGameContent} in={endGameModalOpen}>
        <div>
          <img src={Skull} alt="Skull" />
          <Typography variant="h5">Game over!</Typography>
          <Typography variant="subtitle1">
            {winner === "undefined" || redPoints === bluePoints ? (
              <span>Everybody wins</span>
            ) : winner !== "undefined" ? (
              <span style={{ color: winner }}>{winner} wins</span>
            ) : parseInt(redPoints) > parseInt(bluePoints) ? (
              <span style={{ color: "red" }}>Red wins</span>
            ) : (
              <span style={{ color: "blue" }}>Blue wins</span>
            )}
          </Typography>
          <Typography>
            <span style={{ color: "red" }}>{redPoints}</span> :{" "}
            <span style={{ color: "blue" }}>{bluePoints}</span>
          </Typography>
          <Button
            className={classes.formButton}
            onClick={() => setEndGameModalOpen(false)}
          >
            New game
          </Button>
        </div>
      </Fade>
    </Modal>
  );
};

export default GameOverComponent;
