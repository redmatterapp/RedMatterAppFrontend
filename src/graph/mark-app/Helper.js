import MarkLogicle from "./logicleMark";
import numeral from "numeral";

const minLabelPadding = 30;

const DEFAULT_PLOT_TYPE = "scatter";
const DEFAULT_X_AXIS_LABEL = "FSC-A";
const DEFAULT_Y_AXIS_LABEL = "SSC-A";
const DEFAULT_PLOT_WIDTH = 200;
const DEFAULT_PLOT_HEIGHT = 200;
const DEFAULT_X_SCALE_TYPE = "lin";
const DEFAULT_Y_SCALE_TYPE = "lin";

export const superAlgorithm = (OriginalFiles, OriginalWorkspaceState) => {
  // event 1 is not in any gate, it will have color black
  // event 2 is in both gate, it will have the color of the last gate
  // event 3 is in gate 1 but not in gate 2, it will have the color of gate 1

  let Files = JSON.parse(JSON.stringify(OriginalFiles));
  let WorkspaceState = JSON.parse(JSON.stringify(OriginalWorkspaceState));

  // TODO logicle here needs to be got correctly
  let logicle = new MarkLogicle(0, 262144);
  let controlFileId = WorkspaceState.controlFileId;

  for (let fileIndex = 0; fileIndex < Files.length; fileIndex++) {
    let file = Files[fileIndex];
    let gateStatsObj = {};

    for (
      let eventIndex = 0;
      eventIndex < Files[fileIndex].events.length;
      eventIndex++
    ) {
      let event = Files[fileIndex].events[eventIndex];

      // if the file has its own plots, use that, otherwise use control file plots
      let plots = WorkspaceState.files[file.id]
        ? WorkspaceState.files[file.id].plots
        : WorkspaceState.files[controlFileId].plots;

      for (let plotIndex = 0; plotIndex < plots.length; plotIndex++) {
        let isInGate;
        let plot = plots[plotIndex];
        if (!event["color"]) {
          event["color"] = "#000";
        }

        if (plot.gate) {
          let gate = plot.gate;

          let pointX = event[gate["xAxisIndex"]];
          let pointY = event[gate["yAxisIndex"]];
          let tranformedPoints = [];

          // if a gate was made on an axis with the scale logicle, we need to convert it with logicle transform
          // same for the event point
          // a gate can be created on a linear scale on 1 axis, and logicle on the other
          if (gate["xScaleType"] === "bi") {
            pointX = logicle.scale(pointX);
            // TODO maybe we should just store logicle axis points in logile i.e. between 0 and 1?
            // either way this inefficient here - the logicle transform of the gate point needs only to be done once
            tranformedPoints = gate.points.map((point) => {
              return [logicle.scale(point[0]), point[1]];
            });
          } else {
            tranformedPoints = gate.points.map((point) => {
              return [point[0], point[1]];
            });
          }

          if (gate["yScaleType"] === "bi") {
            pointY = logicle.scale(pointY);
            // TODO maybe we should just store logicle axis points in logile i.e. between 0 and 1?
            // either way this inefficient here - the logicle transform of the gate point needs only to be done once
            tranformedPoints = tranformedPoints.map((point) => {
              return [point[0], logicle.scale(point[1])];
            });
          }

          tranformedPoints = tranformedPoints.map((point) => {
            return { x: point[0], y: point[1] };
          });

          // console.log("gate.name is ", gate.name);
          // console.log("isInGate is ", isInGate);
          // console.log("gate is ", gate);

          isInGate = pointInsidePolygon(
            {
              x: pointX,
              y: pointY,
            },
            tranformedPoints
          );

          if (isInGate) {
            event["color"] = gate["color"];
            event["isInGate" + gate.name] = true;
            !gateStatsObj[gate.name + "_count"]
              ? (gateStatsObj[gate.name + "_count"] = 1)
              : gateStatsObj[gate.name + "_count"]++;
          }
        }
        if (!isInGate) {
          break;
        }
      }
    }

    // const gateCounts = Object.keys(gateStats);
    // gateCounts.forEach((gateCount, index) => {
    //   gateStats[gateCount.replace("_count", "_percentage")] = (
    //     (gateStats[gateCount] * 100) /
    //     Files[fileIndex].events.length
    //   ).toFixed(2);
    // });
    const gateKeys = Object.keys(gateStatsObj);
    let gateStats = [];
    gateKeys.forEach((gateKey, index) => {
      const gateName = gateKey.replace("_count", "");

      let percentage = (
        (gateStatsObj[gateKey] * 100) /
        Files[fileIndex].events.length
      ).toFixed(2);

      gateStats.push({
        gateName: gateName,
        count: gateStatsObj[gateKey],
        percentage: percentage,
      });
    });

    Files[fileIndex].gateStats = gateStats;
  }

  return Files;
};

export function isPointInPolygon(latitude, longitude, polygon) {
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    throw new TypeError("Invalid latitude or longitude. Numbers are expected");
  } else if (!polygon || !Array.isArray(polygon)) {
    throw new TypeError("Invalid polygon. Array with locations expected");
  } else if (polygon.length === 0) {
    throw new TypeError("Invalid polygon. Non-empty Array expected");
  }

  const x = latitude;
  const y = longitude;

  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

export const pointInsidePolygon = ({ x, y }, polygon) => {
  const onSegment = (p, q, r) => {
    if (
      q.x <= Math.max(p.x, r.x) &&
      q.x >= Math.min(p.x, r.x) &&
      q.y <= Math.max(p.y, r.y) &&
      q.y >= Math.min(p.y, r.y)
    )
      return true;
    return false;
  };

  const orientation = (p, q, r) => {
    let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

    if (val === 0) return 0; // colinear

    return val > 0 ? 1 : 2; // clock or counterclock wise
  };

  const segmentIntersection = (p1, p2, q1, q2) => {
    let o1 = orientation(p1, q1, p2);
    let o2 = orientation(p1, q1, q2);
    let o3 = orientation(p2, q2, p1);
    let o4 = orientation(p2, q2, q1);

    // General case
    if (o1 !== o2 && o3 !== o4) return true;

    // Special Cases
    // p1, q1 and p2 are colinear and p2 lies on segment p1q1
    if (o1 === 0 && onSegment(p1, p2, q1)) return true;

    // p1, q1 and q2 are colinear and q2 lies on segment p1q1
    if (o2 === 0 && onSegment(p1, q2, q1)) return true;

    // p2, q2 and p1 are colinear and p1 lies on segment p2q2
    if (o3 === 0 && onSegment(p2, p1, q2)) return true;

    // p2, q2 and q1 are colinear and q1 lies on segment p2q2
    if (o4 === 0 && onSegment(p2, q1, q2)) return true;

    return false; // Doesn't fall in any of the above cases
  };
  const p1 = {
    x: 1e30,
    y: y,
  };
  const q1 = {
    x: x,
    y: y,
  };
  let hits = 0;
  const pl = polygon.length;
  for (let i = 0; i < pl; i++) {
    const a = polygon[i];
    const b = polygon[(i + 1) % pl];
    const p2 = {
      x: a.x,
      y: a.y,
    };
    const q2 = {
      x: b.x,
      y: b.y,
    };
    if (segmentIntersection(p1, p2, q1, q2)) {
      if (orientation(p2, q1, q2) === 0) return onSegment(p2, q1, q2);
      hits++;
    }
  }
  if (hits & 1) return true;
  return false;
};

export const graphLine = (params, ctx) => {
  let xpts = Math.round(
    (Math.max(params.x1, params.x2) - Math.min(params.x1, params.x2)) /
      params.bins
  );

  let ypts = Math.round(
    (Math.max(params.y1, params.y2) - Math.min(params.y1, params.y2)) /
      params.bins
  );

  drawSegment(
    {
      x1: params.x1,
      y1: params.y1,
      x2: params.x2,
      y2: params.y2,
      lineWidth: 2,
    },
    ctx
  );

  if (params.x1 !== params.x2 && params.y1 !== params.y2) {
    throw new Error("Plot line is not vertical nor horizontal");
  }

  const orientation = params.x1 === params.x2 ? "v" : "h";
  const bins =
    params.bins !== undefined ? params.bins : orientation === "v" ? ypts : xpts;
  const p1 = orientation === "v" ? params.y1 : params.x1;
  const p2 = orientation === "v" ? params.y2 : params.x2;
  const op1 = orientation === "v" ? params.x1 : params.y1;
  const op2 = orientation === "v" ? params.x2 : params.y2;

  let counter = bins;
  let interval = Math.max(p1, p2) - Math.min(p1, p2);

  if (params.labels !== undefined) {
    let min = orientation === "h" ? params.ib : params.ib;
    let max = orientation === "h" ? params.ie : params.ie;
    let lastLabelPos = null;

    if (orientation === "v") {
      for (const label of params.labels) {
        let pos = (label.pos - min) / (max - min);
        const y = Math.abs(p1 - p2) * (1 - pos) + Math.min(p1, p2);
        if (lastLabelPos !== null && lastLabelPos < y) {
          continue;
        }
        drawSegment(
          {
            x1: op1 - 14,
            y1: y,
            x2: op1 + 14,
            y2: y,
            lineWidth: 1,
          },
          ctx
        );
        drawText(
          {
            x: op1 - 90,
            y: y + 8,
            text: label.name,
            font: "20px Arial",
            fillColor: "black",
          },
          ctx
        );
        lastLabelPos = y - minLabelPadding;
      }
    } else {
      for (const label of params.labels) {
        let pos = (label.pos - min) / (max - min);
        const x = Math.abs(p1 - p2) * pos + Math.min(p1, p2);
        if (lastLabelPos !== null && lastLabelPos > x) {
          continue;
        }
        drawSegment(
          {
            x1: x,
            y1: op2 - 14,
            x2: x,
            y2: op2 + 14,
            lineWidth: 1,
          },
          ctx
        );
        drawText(
          {
            font: "20px Arial",
            fillColor: "black",
            text: label.name,
            x: x - 24,
            y: op2 + 40,
          },
          ctx
        );
        lastLabelPos = x + minLabelPadding;
      }
    }
    return;
  }

  if (bins === 0 || bins === null || bins === undefined) {
    throw Error("Bins are unset or set as an invalid amount");
  }

  interval /= bins;

  if (interval === 0) {
    throw Error("Width and height are unset");
  }

  if (orientation === "v") {
    for (let y = Math.min(p1, p2); y <= Math.max(p1, p2); y += interval) {
      drawSegment(
        {
          x1: op1 - 14,
          y1: y,
          x2: op1 + 14,
          y2: y,
          lineWidth: 1,
        },
        ctx
      );

      let textWrite = numToLabelText(
        (Math.abs(params.ie - params.ib) / ypts) * counter + params.ib
      );

      drawText(
        {
          x: op1 - 90,
          y: y + 8,
          text: textWrite,
          font: "20px Arial",
          fillColor: "black",
        },
        ctx
      );
      counter--;
    }
  } else {
    for (let x = Math.max(p1, p2); x >= Math.min(p1, p2); x -= interval) {
      drawSegment(
        {
          x1: x,
          y1: op2 - 14,
          x2: x,
          y2: op2 + 14,
          lineWidth: 1,
        },
        ctx
      );
      let textWrite = numToLabelText(
        (Math.abs(params.ie - params.ib) / xpts) * counter + params.ib
      );

      drawText(
        {
          font: "20px Arial",
          fillColor: "black",
          text: textWrite,
          x: x - 24,
          y: op2 + 40,
        },
        ctx
      );
      counter--;
    }
  }
};

export const getPlotChannelAndPosition = (file) => {
  const defaultFileChannels = file?.channels;

  const expectedXChannels = ["FSC-A", "FSC.A", "FSC-H", "FSC.H"];
  let xAxisLabel = "";
  let xAxisIndex = defaultFileChannels.findIndex((channel) =>
    expectedXChannels.includes(channel?.value?.toUpperCase())
  );

  let yAxisLabel = "";
  const expectedYChannels = ["SSC-A", "SSC.A", "SSC-H", "SSC.H"];
  let yAxisIndex = defaultFileChannels.findIndex((channel, position) =>
    expectedYChannels.includes(channel?.value?.toUpperCase())
  );

  if (xAxisIndex > -1) xAxisLabel = defaultFileChannels[xAxisIndex]?.value;
  else
    xAxisIndex = Math.floor(Math.random() * (defaultFileChannels?.length - 1));

  if (yAxisIndex > -1) yAxisLabel = defaultFileChannels[yAxisIndex]?.value;
  else
    yAxisIndex = Math.floor(Math.random() * (defaultFileChannels?.length - 1));

  // if(defaultFileChannels.includes("FSC-H")) {
  //     xAxisIndex = defaultFileChannels.findIndex((ch) => ch?.value?.toUpperCase() === "FSC-H");
  //     xAxisLabel = "FSC-H";
  // }else if(defaultFileChannels.includes("FSC.H")){
  //     xAxisIndex = defaultFileChannels.findIndex((ch) => ch?.value?.toUpperCase() === "FSC.H");
  //     xAxisLabel = "FSC.H";
  // } else if(defaultFileChannels.includes("FSC-A")) {
  //     xAxisIndex = defaultFileChannels.findIndex((ch) => ch?.value?.toUpperCase() === "FSC-A");
  //     xAxisLabel = "FSC-A";
  // } else if(defaultFileChannels.includes("FSC.A")){
  //     xAxisIndex = defaultFileChannels.findIndex((ch) => ch?.value?.toUpperCase() === "FSC.A");
  //     xAxisLabel = "FSC.A";
  // } else
  //     xAxisIndex = Math.floor(Math.random() * (defaultFileChannels?.length - 1));
  //
  // if(defaultFileChannels.includes("SSC-H")) {
  //     yAxisIndex = defaultFileChannels.findIndex((ch) => ch?.value?.toUpperCase() === "SSC-H");
  //     yAxisLabel = "SSC-H"
  // }else if(defaultFileChannels.includes("SSC.H")) {
  //     yAxisIndex = defaultFileChannels.findIndex((ch) => ch?.value?.toUpperCase() === "SSC.H");
  //     yAxisLabel = "SSC.H"
  // } else if(defaultFileChannels.includes("SSC.A")) {
  //     yAxisIndex = defaultFileChannels.findIndex((ch) => ch?.value?.toUpperCase() === "SSC.A");
  //     yAxisLabel = "SSC.A"
  // } else if(defaultFileChannels.includes("SSC-A")) {
  //     yAxisIndex = defaultFileChannels.findIndex((ch) => ch?.value?.toUpperCase() === "SSC-A");
  //     yAxisLabel = "SSC-A"
  // }else
  //     yAxisIndex = Math.floor(Math.random() * (defaultFileChannels?.length - 1));

  xAxisLabel = xAxisLabel || defaultFileChannels[xAxisIndex]?.value;
  yAxisLabel = yAxisLabel || defaultFileChannels[yAxisIndex]?.value;

  return { xAxisLabel, yAxisLabel, xAxisIndex, yAxisIndex };
};

export const createDefaultPlotSnapShot = (
  fileId,
  experimentId,
  xAxisLabel = DEFAULT_X_AXIS_LABEL,
  yAxisLabel = DEFAULT_Y_AXIS_LABEL,
  xAxisIndex = 0,
  yAxisIndex = 1,
  pipelineId = "",
  name = "",
  plotType = DEFAULT_PLOT_TYPE
) => {
  return {
    experimentId: experimentId,
    controlFileId: fileId,
    pipelineId: pipelineId,
    name:name,
    files: {
      [fileId]: {
        plots: [
          {
            population: "All",
            plotType: plotType || DEFAULT_PLOT_TYPE,
            width: DEFAULT_PLOT_WIDTH,
            height: DEFAULT_PLOT_HEIGHT,
            xAxisLabel: xAxisLabel || DEFAULT_X_AXIS_LABEL,
            yAxisLabel: yAxisLabel || DEFAULT_Y_AXIS_LABEL,
            xAxisIndex: xAxisIndex,
            yAxisIndex: yAxisIndex,
            plotScale: 2,
            xScaleType: DEFAULT_X_SCALE_TYPE,
            yScaleType: DEFAULT_Y_SCALE_TYPE,
            histogramAxis: "",
            label: "",
            dimensions: {
              w: 9,
              h: 10,
            },
            positions: {
              x: 0,
              y: 0,
            },
            parentPlotId: "",
            gatingActive: "",
          },
        ],
      },
    },
    sharedWorkspace: "false",
    editWorkspace: "true",
    selectedFile: fileId,
    clearOpenFiles: "false",
    isShared: "false",
  };
};

const numToLabelText = (num) => {
  let snum = "";
  if (num < 2) {
    snum = numeral(num.toFixed(2)).format("0.0a");
  } else {
    snum = num.toFixed(2);
    snum = numeral(snum).format("0a");
  }
  return snum;
};

const drawSegment = (params, ctx) => {
  ctx.strokeStyle = params.strokeColor;
  ctx.lineWidth = params.lineWidth;

  ctx.beginPath();
  ctx.moveTo(params.x1, params.y1);
  ctx.lineTo(params.x2, params.y2);
  ctx.stroke();
};

const drawText = (params, ctx) => {
  ctx.fillStyle = params.fillColor;
  if (params.font !== undefined) {
    ctx.font = params.font;
  }
  if (params.rotate !== undefined) {
    ctx.rotate(params.rotate);
    const bx = params.x;
    const by = params.y;
    params.x = -bx * Math.cos(params.rotate) + by * Math.sin(params.rotate);
    params.y = -bx * Math.sin(params.rotate) - by * Math.cos(params.rotate);
  }
  ctx.fillText(params.text, params.x, params.y);
  ctx.font = "Arial";
  if (params.rotate !== undefined) {
    ctx.rotate(-params.rotate);
  }
};
