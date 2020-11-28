import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';

const useStyles = makeStyles({
  root: {
    height: 'inherit',
    width: 'inherit'
  },
  refresh: {
    'text-align': 'center',
    '&:hover': {
      backgroundColor: 'inherit',
      color: 'red',
      'font-weight': 'bold',
    },
    '&:click': {
      backgroundColor: 'inherit',
      'font-weight': 'bold',
    },
  },
  join: {
    color: 'red',
    'font-weight': 'bold',
    '&:hover': {
      backgroundColor: 'red',
      color: 'white',
      'font-weight': 'bold',
    },
  }
});

const GameTable = ({ gameList, onJoin, onRefresh }) => {
  const classes = useStyles();

  const columns = [
    { field: 'id', headerName: 'ID', hide: true, width: 0 },
    { field: 'gameID', headerName: 'Game ID', hide: true, width: 0 },
    { field: 'gameName', headerName: 'Game Name', flex: 0.25, },
    { field: 'host', headerName: 'Host', flex: 0.25, },
    { field: 'capacity', headerName: 'Capacity', flex: 0.25, },
    { field: 'status', headerName: 'Status', flex: 0.25,},
    {
      field: "",
      headerName: <Button className={classes.refresh} disableRipple={true} onClick={onRefresh}> Refresh </Button>,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params: CellParams) => {
        return <Button className={classes.join} disableRipple={true} disabled={params.data.status === "started"} onClick={() => onJoin(params.data.gameID)}>Join</Button>;
      }
    },
  ];

  const rows = gameList.map((value, i) => {
    return {
      id: i,
      gameID: value.id,
      gameName: value.gameName,
      host: value.host,
      capacity: value.playerNum + ' / ' + value.maxPlayerNum,
      status: value.isStart ? "started" : "waiting"
    }
  })
  console.log(rows)

  return (
    <div className={classes.root}>
      <DataGrid
        className={classes.table}
        rows={rows}
        columns={columns}
        autoPageSize={true}
      />
    </div>
  );
}

export default GameTable ;
