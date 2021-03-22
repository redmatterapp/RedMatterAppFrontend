import React from "react";
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
} from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { NavLink } from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";

import Done from "@material-ui/icons/Done";

import formSteps from "./FormSteps";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    fontFamily: "Raleway",
  },
  emptyButton: {
    height: 50,
    marginRight: 20,
    width: 170,
    border: "solid 2px #66a",
    color: "#66a",
  },
  filledButton: {
    height: 50,
    marginRight: 20,
    width: 170,
    backgroundColor: "#66a",
    color: "white",
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  marginButton: {
    margin: theme.spacing(1),
    width: 170,
    height: 50,
    backgroundColor: "#66a",
    color: "#fff",
  },
  activeStepLabel: {
    color: "white",
  },
  avatar: {
    width: "1em",
    height: "1em",
    backgroundColor: "#fafafa",
  },
}));

function getSteps() {
  return [
    "Device selection",
    "Cell type",
    "Particle size",
    "Fluorophores category",
    "Description",
  ];
}

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return formSteps.formDeviceType;
    case 1:
      return formSteps.formCellType;
    case 2:
      return formSteps.formParticleSize;
    case 3:
      return formSteps.formFlurophores;
    case 4:
      return formSteps.formDescription;
    default:
      throw Error("Unknown step");
  }
}

export default function PrototypeForm() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const steps = getSteps();

  const isStepOptional = (step: number) => {
    return getStepContent(step).optional;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Grid
      style={{
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "#fafafa",
        borderRadius: 10,
        marginBottom: 50,
        textAlign: "center",
        paddingBottom: 10,
        marginTop: 30,
      }}
      md={12}
      lg={9}
      xl={6}
      item={true}
    >
      <Stepper
        activeStep={activeStep}
        style={{
          backgroundColor: "#66a",
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
        }}
      >
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: { optional?: React.ReactNode } = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography
                variant="caption"
                style={{
                  color: "white",
                  fontSize: 13,
                  fontFamily: "Raleway",
                }}
              ></Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel
                {...labelProps}
                icon={
                  <Avatar
                    className={classes.avatar}
                    style={{
                      background:
                        activeStep > index
                          ? "#eee"
                          : activeStep == index
                          ? "#fff"
                          : "#aad",
                    }}
                  >
                    {activeStep > index ? (
                      <Done
                        fontSize="small"
                        style={{ color: "#333", fontSize: 15 }}
                      />
                    ) : (
                      <b></b>
                    )}
                  </Avatar>
                }
              >
                <b
                  style={{
                    color: activeStep === index ? "#fff" : "#ddf",
                    fontWeight: activeStep === index ? 700 : 400,
                    fontFamily: "Raleway",
                  }}
                >
                  {label}
                </b>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <h1 style={{ fontFamily: "Raleway", marginTop: 30 }}>
              All steps completed!
            </h1>
            <h4
              style={{
                fontFamily: "Raleway",
                marginTop: -10,
                marginBottom: 30,
                color: "#777",
              }}
            >
              The information you've given us will help to better setup your
              graphs
            </h4>
            <Button
              onClick={handleReset}
              className={classes.emptyButton}
              style={{
                border: "solid 2px #379",
                color: "#379",
              }}
            >
              <Typography
                style={{ fontSize: 15, color: "#66a", fontWeight: 500 }}
              >
                Reset
              </Typography>
            </Button>
            <NavLink to="/graph" style={{ color: "white" }}>
              <Button variant="contained" className={classes.marginButton}>
                Start Graphing!
              </Button>
            </NavLink>
          </div>
        ) : (
          <div>
            <Typography
              className={classes.instructions}
              style={{ marginTop: 20 }}
            >
              <h3>{getStepContent(activeStep).title}</h3>
            </Typography>

            {getStepContent(activeStep).component}

            <div
              style={{
                marginTop: 30,
              }}
            >
              <Divider style={{ margin: 10 }}></Divider>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.emptyButton}
              >
                <Typography
                  style={{ fontSize: 15, color: "#66a", fontWeight: 500 }}
                >
                  Back
                </Typography>
              </Button>
              {isStepOptional(activeStep) && (
                <Button
                  variant="contained"
                  onClick={handleSkip}
                  className={classes.filledButton}
                >
                  Skip
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleNext}
                className={classes.filledButton}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Grid>
  );
}
