import React from 'react'
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  header: {
    textAlign: 'center'
  },
  title: {
  }
}));

function GraphPrototype() {
  const classes = useStyles();
  return (
    <div className={classes.header}>
    </div>
  );
}

export default GraphPrototype;
