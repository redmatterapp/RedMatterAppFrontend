import React, { useEffect } from "react";
import { CSVLink } from "react-csv";
import GetAppIcon from "@material-ui/icons/GetApp";
import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import { Button, FormControlLabel, MenuItem, Select } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { snackbarService } from "uno-material-ui";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import { ArrowLeftOutlined } from "@ant-design/icons";
import userManager from "Components/users/userManager";
import { saveWorkspaceStateToServer } from "../utils/workspace";

import { Typography } from "antd";
import WorkspaceDispatch from "../workspaceRedux/workspaceDispatchers";
import IOSSwitch from "../../Components/common/Switch";
import ShareIcon from "assets/images/share.png";
import MessageModal from "./modals/MessageModal";
import AddFileModal from "./modals/AddFileModal";
import axios from "axios";
import { Debounce } from "../../services/Dbouncer";
import LinkShareModal from "./modals/linkShareModal";
//import GateNamePrompt from "./modals/GateNamePrompt";
// @ts-ignore
//import PipeLineNamePrompt from "./modals/PipelineNamePrompt";
import { getWorkspace, getAllFiles, getFiles } from "graph/utils/workspace";
import { useSelector } from "react-redux";
import useDidMount from "hooks/useDidMount";
import {
  createDefaultPlotSnapShot,
  getPlotChannelAndPosition,
  formatEnrichedFiles,
  superAlgorithm,
  getMedian,
  DEFAULT_PLOT_TYPE,
} from "graph/mark-app/Helper";
import { File } from "graph/resources/types";

interface Props {
  experimentId: string;
  sharedWorkspace: boolean;
  plotCallNeeded: boolean;
  renderPlotController: boolean;
  // setRenderPlotController: React.Dispatch<React.SetStateAction<boolean>>;
  // setPlotCallNeeded: React.Dispatch<React.SetStateAction<boolean>>;
  // setLoader?: React.Dispatch<React.SetStateAction<boolean>>;
}

const TIME_INTERVAL = 35000;

const WorkspaceTopBar = (props) => {
  const history = useHistory();

  const [data, setData] = React.useState<any[]>([]);
  const [heeaderForCSV, setHeaderForCSV] = React.useState<any[]>([]);

  useEffect(() => {
    updateHeaders();
  }, []);

  const updateHeaders = () => {
    const headers = [
      { label: "File Name", key: "fileName" },
      { label: "Gate Name", key: "gateName" },
      { label: "X Channel", key: "xChannel" },
      { label: "Y Channel", key: "yChannel" },
      { label: "Percentage", key: "percentage" },
    ];
    let copyOfFiles: any[] = props.fcsFiles;
    const channels =
      copyOfFiles.length > 0
        ? copyOfFiles[0]?.channels.map(
            (element: any) => element?.label || element?.value
          )
        : [];

    for (let i = 0; i < channels.length; i++) {
      headers.push({ label: `${channels[i]} Mean`, key: `channel${i}Mean` });
      headers.push({
        label: `${channels[i]} Median`,
        key: `channel${i}Median`,
      });
    }
    setHeaderForCSV(headers);
  };

  const downloadCSV = () => {
    let workspaceState = props.workspaceState;
    // @ts-ignore
    const plots =
      workspaceState &&
      // @ts-ignore
      workspaceState?.files?.[workspaceState.controlFileId]?.plots;
    let isSnapShotCreated = false;
    let copyOfFiles: any[] = props.fcsFiles;
    if (plots === null || plots === undefined) {
      const defaultFile = copyOfFiles?.[0];
      const {
        xAxisLabel,
        yAxisLabel,
        xAxisIndex,
        yAxisIndex,
        xAxisScaleType,
        yAxisScaleType,
      } = getPlotChannelAndPosition(defaultFile);
      workspaceState = createDefaultPlotSnapShot(
        defaultFile?.id,
        xAxisLabel,
        yAxisLabel,
        xAxisIndex,
        yAxisIndex
      );
      isSnapShotCreated = true;
    }

    let fcsFiles: any[] = superAlgorithm(copyOfFiles, workspaceState, true);

    const channels =
      copyOfFiles.length > 0
        ? copyOfFiles[0]?.channels.map(
            (element: any) => element?.label || element?.value
          )
        : [];
    const obj: any = {};
    for (let i = 0; i < channels.length; i++) {
      obj[channels[i]] = [];
    }

    fcsFiles = formatEnrichedFiles(fcsFiles, workspaceState);
    const csvData = [];
    const eventsSeparatedByChannels: any = {};
    for (let i = 0; i < fcsFiles.length; i++) {
      eventsSeparatedByChannels[fcsFiles[i].fileId] = [];
    }

    for (let fileIndex = 0; fileIndex < fcsFiles.length; fileIndex++) {
      for (
        let statsIndex = 0;
        statsIndex < fcsFiles[fileIndex].gateStats.length;
        statsIndex++
      ) {
        let channelsObj: any = {};
        for (let i = 0; i < channels.length; i++) {
          channelsObj[channels[i]] = {
            array: [],
            sum: 0,
            mean: 0,
            median: 0,
          };
        }
        channelsObj.percentage = 0;
        channelsObj.gateName = "";
        channelsObj.xChannel = "";
        channelsObj.gateName = "";
        if (fcsFiles[fileIndex]?.gateStats[statsIndex]?.percentage) {
          const events =
            fcsFiles[fileIndex]?.gateStats[statsIndex]?.eventsInsideGate;
          channelsObj.percentage =
            fcsFiles[fileIndex]?.gateStats[statsIndex]?.percentage;
          channelsObj.gateName =
            fcsFiles[fileIndex]?.gateStats[statsIndex]?.gateName;
          channelsObj.xChannel =
            fcsFiles[fileIndex].plots[statsIndex].xAxisLabel;
          channelsObj.yChannel =
            fcsFiles[fileIndex].plots[statsIndex].yAxisLabel;

          for (
            let eventsIndex = 0;
            eventsIndex < events.length;
            eventsIndex++
          ) {
            for (
              let channelIndex = 0;
              channelIndex < events[eventsIndex].length;
              channelIndex++
            ) {
              channelsObj[channels[channelIndex]].array.push(
                events[eventsIndex][channelIndex]
              );
              channelsObj[channels[channelIndex]].sum +=
                events[eventsIndex][channelIndex];
              channelsObj[channels[channelIndex]].percentage =
                fcsFiles[fileIndex]?.gateStats[statsIndex]?.percentage;
            }
          }

          eventsSeparatedByChannels[fcsFiles[fileIndex].fileId].push(
            JSON.parse(JSON.stringify(channelsObj))
          );
        }
        channelsObj = {};
      }
    }

    for (let fileIndex = 0; fileIndex < fcsFiles.length; fileIndex++) {
      for (
        let channelIndex = 0;
        channelIndex < channels.length;
        channelIndex++
      ) {
        for (
          let statsIndex = 0;
          statsIndex <
          eventsSeparatedByChannels[fcsFiles[fileIndex].fileId].length;
          statsIndex++
        ) {
          if (
            eventsSeparatedByChannels[fcsFiles[fileIndex].fileId][statsIndex][
              channels[channelIndex]
            ]?.array.length > 0
          ) {
            eventsSeparatedByChannels[fcsFiles[fileIndex].fileId][statsIndex][
              channels[channelIndex]
            ].mean = (
              eventsSeparatedByChannels[fcsFiles[fileIndex].fileId][statsIndex][
                channels[channelIndex]
              ]?.sum /
              eventsSeparatedByChannels[fcsFiles[fileIndex].fileId][statsIndex][
                channels[channelIndex]
              ]?.array.length
            ).toFixed(2);

            eventsSeparatedByChannels[fcsFiles[fileIndex].fileId][statsIndex][
              channels[channelIndex]
            ].median = getMedian(
              eventsSeparatedByChannels[fcsFiles[fileIndex].fileId][statsIndex][
                channels[channelIndex]
              ].array
            );
          }
        }
      }
    }

    for (let fileIndex = 0; fileIndex < fcsFiles.length; fileIndex++) {
      for (
        let statsIndex = 0;
        statsIndex <
        eventsSeparatedByChannels[fcsFiles[fileIndex].fileId].length;
        statsIndex++
      ) {
        const stats: any = {
          fileName: fcsFiles[fileIndex]?.label,
          gateName:
            eventsSeparatedByChannels[fcsFiles[fileIndex].fileId][statsIndex]
              ?.gateName,
          percentage:
            eventsSeparatedByChannels[fcsFiles[fileIndex].fileId][statsIndex]
              ?.percentage,
          xChannel:
            eventsSeparatedByChannels[fcsFiles[fileIndex].fileId][statsIndex]
              ?.xChannel,
          yChannel:
            eventsSeparatedByChannels[fcsFiles[fileIndex].fileId][statsIndex]
              ?.yChannel,
        };
        for (
          let channelIndex = 0;
          channelIndex < channels.length;
          channelIndex++
        ) {
          const median = `channel${channelIndex}Median`;
          const mean = `channel${channelIndex}Mean`;
          stats[median] =
            eventsSeparatedByChannels[fcsFiles[fileIndex].fileId][statsIndex][
              channels[channelIndex]
            ]?.median;

          stats[mean] =
            eventsSeparatedByChannels[fcsFiles[fileIndex].fileId][statsIndex][
              channels[channelIndex]
            ]?.mean;
        }
        csvData.push(stats);
      }
    }

    setData(csvData);
  };

  const _renderToolbar = () => {
    let hasGate =
      // @ts-ignore
      props.workspaceState?.files?.[getWorkspace()?.controlFileId]?.plots
        ?.length > 1;

    return (
      <Button
        variant="contained"
        size="small"
        onClick={() => downloadCSV()}
        // className={classes.topButton}
        style={{
          backgroundColor: "#fafafa",
          float: "right",
          marginRight: 10,
        }}
        //disabled={!hasGate}
      >
        <CSVLink
          headers={heeaderForCSV}
          data={data}
          filename="WorkspaceReport.csv"
          // className={classes.downloadBtnLayout}
        >
          <GetAppIcon fontSize="small" style={{ marginRight: 10 }}></GetAppIcon>
          Download Stats
        </CSVLink>
      </Button>
    );
  };

  const renderToolBarUI = () => {
    return (
      <>
        {/* == MAIN PANEL == */}
        {_renderToolbar()}
      </>
    );
  };

  return renderToolBarUI();
};

export default WorkspaceTopBar;
