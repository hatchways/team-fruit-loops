import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Dropzone from 'react-dropzone'

import {
  Card,
  CardActionArea,
  CardMedia,
  Tooltip,
  Avatar
} from '@material-ui/core'

const axios = require('axios')

const useStyles = makeStyles(theme => ({
  card: {
    width: '200px',
    margin: '10px auto 0',
    padding: '10px 0'
  },
  avatar: {
    margin: 'auto',
    height: '170px',
    width: '170px',
    border: '5px solid rgba(0, 0, 0, 0.5)',
    fontSize: '100px'
  }
}))

const UploadImage = props => {
  const classes = useStyles()

  const onDropAccepted = acceptedFiles => {
    let data = new FormData()
    data.append('id', props.values['id'])
    data.append('image', acceptedFiles[0])

    axios
      .post('/uploadImage', data)
      .then(res => {
        props.setValues({
          id: props.values['id'],
          name: props.values['name'],
          email: props.values['email'],
          imageUrl: res.data.imageUrl
        })

        props.setAccountValues({
          name: props.values['name'],
          email: props.values['email'],
          imageUrl: res.data.imageUrl
        })
      })
      .catch(err => {})
  }

  return (
    <Dropzone
      onDropAccepted={onDropAccepted}
      accept='image/*'
      minSize={0}
      maxSize={5242880}
    >
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        fileRejections
      }) => {
        const isFileTooLarge =
          fileRejections.length > 0 && fileRejections[0].size > 5242880
        return (
          <div {...getRootProps()}>
            <Tooltip title='Click or drag image here to set as profile picture'>
              <Card className={classes.card}>
                <CardActionArea>
                  <CardMedia>
                    {/* Add a Date.now() append to force image refresh when uploaded */}
                    <Avatar
                      src={`${props.values['imageUrl']}?${Date.now()}` || ''}
                      className={classes.avatar}
                    >
                      {props.values['name'] ? props.values['name'][0] : ''}
                    </Avatar>
                  </CardMedia>
                  <input {...getInputProps()} />
                  {isDragReject && 'File type not accepted'}
                  {isFileTooLarge &&
                    'File is too large (Please select a file <= 5 MB).'}
                </CardActionArea>
              </Card>
            </Tooltip>
          </div>
        )
      }}
    </Dropzone>
  )
}

export default UploadImage
