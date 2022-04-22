import React from "react";
import { NavLink } from "react-router-dom";
import { snackbarService } from "uno-material-ui";
import { useHistory } from "react-router-dom";
import axios from "axios";
import userManager from "Components/users/userManager";
import {
  Grid,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Tooltip,
} from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";

import { getHumanReadableTimeDifference } from "utils/time";
import { ExperimentApiFetchParamCreator } from "api_calls/nodejsback";
import MessageModal from "graph/components/modals/MessageModal";

const styles = {
  title: {
    fontSize: 14,
    color: "#222",
  },
  ownerTitle: {
    fontSize: 12,
    color: "#222",
    fontWeight: 500,
  },
};

export default function ExperimentCard(props: { data: any; update: Function }) {
  const history = useHistory();

  const getTimeCal = (date: string) => {
    return getHumanReadableTimeDifference(new Date(date), new Date());
  };

  const deleteExperiment = () => {
    const fetchArgs = ExperimentApiFetchParamCreator({
      accessToken: userManager.getToken(),
    }).deleteExperiment(props.data.id, userManager.getToken());
    axios
      .delete(`/api/experiment/${props.data.id}/delete`, fetchArgs.options)
      .then(async (response:any) => {
        if (response?.data?.level === "success") {
          props.update(props.data.id);
          showMessageBox({
              message: response?.data?.message || "Report Generating Success",
              saverity: "success",
            });

        } else if (response?.data?.level === "danger") {
          showMessageBox({
            message: response?.data?.message || "Request Not Completed",
            saverity: "error",
          });
        }else {
          await handleError({
            message: "Information Missing",
            saverity: "error",
          });
        }

      })
      .catch(async (err) => {
        await handleError(err);
      });
  };

  const handleError = async (error: any) => {
    if (
        error?.name === "Error" ||
        error?.message.toString() === "Network Error"
    ) {
      showMessageBox({
        message: "Connectivity Problem, please check your internet connection",
        saverity: "error",
      });
    } else if (error?.response) {
      if (error.response?.status == 401 || error.response.status == 419) {
        setTimeout(() => {
          userManager.logout();
        }, 3000);
        showMessageBox({
          message: "Authentication Failed Or Session Time out",
          saverity: "error",
        });
      }
    } else {
      showMessageBox({
        message: error?.message || "Request Failed. May be Time out",
        saverity: error.saverity || "error",
      });
    }
  };

  const showMessageBox = (response: any) => {
    switch (response.saverity) {
      case "error":
        snackbarService.showSnackbar(response?.message, "error");
        break;
      case "success":
        snackbarService.showSnackbar(response?.message, "success");
        break;
      default:
        break;
    }
  };

  const [deleteConfirmModal, setDeleteConfirmModal] = React.useState(false);
  const rules: any = userManager.getRules();
  const isAdmin: Boolean = userManager.getUserAdminStatus();
  const userEmail: String = userManager.getUserEmail();

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
  };

  return (
    <Grid
      item
      style={{
        padding: 5,
      }}
      xs={6}
      md={4}
      lg={3}
    >
      <MessageModal
        open={deleteConfirmModal}
        closeCall={{
          f: handleClose,
          ref: setDeleteConfirmModal,
        }}
        message={<h2>Are you sure you want to delete this experiment?</h2>}
        options={{
          yes: () => {
            setDeleteConfirmModal(false);
            deleteExperiment();
          },
          no: () => {
            setDeleteConfirmModal(false);
          },
        }}
      />
      <Grid item>
        <Card>
          <NavLink
            to={{
              pathname: `/experiment/${props.data.id}`,
              state: { experimentName: props.data.name },
            }}
          >
            <CardContent style={{ margin: 0, padding: 0, textAlign: "center" }}>
              <div
                style={{
                  backgroundColor: "#6666AA",
                  borderRadius: 10,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              >
                <Typography
                  style={{
                    fontWeight: "bold",
                    color: "#fff",
                    marginBottom: "5px",
                    fontSize: 18,
                    padding: 5,
                  }}
                  color="textPrimary"
                  align="center"
                  gutterBottom
                  noWrap
                >
                  {props.data.name}
                </Typography>
              </div>
              <div>
                {isAdmin && (
                  <Typography
                    style={styles.ownerTitle}
                    color="textSecondary"
                    gutterBottom
                  >
                    Owner:{" "}
                    {props.data.userEmail === userEmail
                      ? "YOU"
                      : props.data.userEmail === undefined
                      ? "User Account Deleted"
                      : props.data.userEmail}
                  </Typography>
                )}
                <Typography
                  style={styles.title}
                  color="textSecondary"
                  gutterBottom
                >
                  Source: {props.data.source}
                </Typography>
                <Typography
                  style={styles.title}
                  color="textSecondary"
                  gutterBottom
                >
                  {getTimeCal(props.data.createdOn)}
                </Typography>
                <Typography
                  style={styles.title}
                  color="textSecondary"
                  gutterBottom
                >
                  {props.data.isPrivate ? "Private" : "Public"}
                </Typography>
                <Typography
                  style={styles.title}
                  color="textSecondary"
                  gutterBottom
                >
                  {props.data.fileCount} files
                </Typography>
              </div>
            </CardContent>
          </NavLink>
          {/*{props.data.fileCount > 0 && <CardActions style={{ display: "flex", justifyContent: "center" }}>*/}
          {/*  /!* Delete Button *!/*/}
          {/*  <Tooltip*/}
          {/*      title={*/}
          {/*        rules?.experiment?.delete*/}
          {/*            ? "Delete experiment"*/}
          {/*            : "The Delete Button is disabled, upgrade your plan to enable it"*/}
          {/*      }*/}
          {/*  >*/}
          {/*    <span>*/}
          {/*      <Button*/}
          {/*          size="small"*/}
          {/*          color="secondary"*/}
          {/*          startIcon={<DeleteIcon />}*/}
          {/*          variant="outlined"*/}
          {/*          onClick={() => setDeleteConfirmModal(true)}*/}
          {/*          disabled={!rules?.experiment?.delete}*/}
          {/*      >*/}
          {/*        Delete*/}
          {/*      </Button>*/}
          {/*    </span>*/}
          {/*  </Tooltip>*/}
          {/*</CardActions> }*/}
        </Card>
      </Grid>
    </Grid>
  );
}
