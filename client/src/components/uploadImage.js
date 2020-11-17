import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dropzone from "react-dropzone";

import {
  Card,
  CardActionArea,
  CardMedia,
  Tooltip,
  Avatar,
} from "@material-ui/core";

const axios = require("axios");

const useStyles = makeStyles((theme) => ({
  card: {
    width: "200px",
    margin: "10px auto 0",
    padding: "10px 0",
  },
  avatar: {
    margin: "auto",
    height: "170px",
    width: "170px",
    border: "5px solid rgba(0, 0, 0, 0.5)",
    fontSize: "100px",
  },
}));

const UploadImage = (props) => {
  const classes = useStyles();

  const [values, setValues] = useState({
    id: "",
    name: "",
    imageUrl: "",
  });

  useEffect(() => {
    axios.get("/account").then((res) => {
      setValues({
        id: res.data._id,
        name: res.data.name,
        imageUrl: res.data.imageUrl,
      });
    });
  }, []);

  const onDropAccepted = (acceptedFiles) => {
    let data = new FormData();
    data.append("id", values["id"]);
    data.append("image", acceptedFiles[0]);

    axios
      .post("/uploadImage", data)
      .then((res) => {
        // TODO: Reload the image without having to refresh the entire page
        setValues({ id: values["id"], imageUrl: res.data.imageUrl });
        window.location.reload();
      })
      .catch((err) => {});
  };

  return (
    <Dropzone
      onDropAccepted={onDropAccepted}
      accept="image/*"
      minSize={0}
      maxSize={5242880}
    >
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        fileRejections,
      }) => {
        const isFileTooLarge =
          fileRejections.length > 0 && fileRejections[0].size > 5242880;
        return (
          <div {...getRootProps()}>
            <Tooltip title="Click or drag image here to set as profile picture">
              <Card className={classes.card}>
                <CardActionArea>
                  <CardMedia>
                    <Avatar src={values["imageUrl"]} className={classes.avatar}>
                      {values["name"] ? values["name"][0] : ""}
                    </Avatar>
                  </CardMedia>
                  <input {...getInputProps()} />
                  {isDragReject && "File type not accepted"}
                  {isFileTooLarge &&
                    "File is too large (Please select a file <= 5 MB)."}
                </CardActionArea>
              </Card>
            </Tooltip>
          </div>
        );
      }}
    </Dropzone>
  );
};

export default UploadImage;
