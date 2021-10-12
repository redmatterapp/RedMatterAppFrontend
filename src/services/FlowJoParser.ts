import { COMMON_CONSTANTS } from "assets/constants/commonConstants";
import { generateColor } from "graph/utils/color";
import { snackbarService } from "uno-material-ui";
import {
  File,
  FileID,
  Plot,
  PlotID,
  PolygonGate,
  Population,
  PopulationGateType,
} from "graph/resources/types";
import * as PlotResource from "graph/resources/plots";
import {
  createEmptyPlot,
  createNewPlotFromFile,
  createPlot,
} from "graph/resources/plots";
import { createPopulation } from "graph/resources/populations";
import { createGate } from "graph/resources/gates";
import { getFile } from "graph/utils/workspace";
import WorkspaceDispatch from "graph/resources/dispatchers";

const getFileOrSkipThisSample = (
  filesUsed: any,
  channelsInfo: any,
  files: any
) => {
  let channels = channelsInfo.map((x: any) => x.channelName);
  let fileCanbeUsed = true;
  let fileId = "";
  let repeatFileUse = false;
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let axes = file.axes;
    for (let j = 0; j < axes.length; j++) {
      let channelCheck = channels.filter((x: string) => axes[j].includes(x));
      if (channelCheck.length == 0) {
        fileCanbeUsed = false;
        break;
      }
    }
    if (fileCanbeUsed) {
      if (filesUsed.includes(file.id)) {
        if (!repeatFileUse) {
          repeatFileUse = true;
          fileId = file.id;
        }
      } else {
        fileId = file.id;
        break;
      }
    }
  }

  return { fileId: fileId ? fileId : null };
};

const ParseFlowJoJson = async (flowJoJson: any, downloadedFiles: any) => {
  try {
    let plots: Array<Plot> = [];
    let workspace = flowJoJson["Workspace"];
    let filesUsed: Array<FileID> = [];
    if (
      workspace &&
      workspace["SampleList"] &&
      workspace["SampleList"]["Sample"]
    ) {
      let sample = workspace["SampleList"]["Sample"];
      let samples = [];
      if (sample.length == undefined) samples.push(sample);
      else samples = sample;
      for (let i = 0; i < samples.length; i++) {
        let sampleNode = samples[i]["SampleNode"];
        let plot: Plot;
        let sampleUri = samples[i]["DataSet"]["_attributes"]["uri"];
        let sampleUrlArray = sampleUri.split("/");
        let sampleName = sampleUrlArray[sampleUrlArray.length - 1];
        sampleName = sampleName.replaceAll("%20", "");
        let transformations = samples[i]["Transformations"];
        let channelsInfo: any = [];
        if (transformations) {
          let logTransformations = transformations["transforms:log"];
          if (logTransformations && logTransformations.length == undefined)
            logTransformations = [logTransformations];
          let linearTransformations = transformations["transforms:linear"];
          if (
            linearTransformations &&
            linearTransformations.length == undefined
          )
            linearTransformations = [linearTransformations];
          let biexTransformations = transformations["transforms:biex"];
          if (biexTransformations && biexTransformations.length == undefined)
            biexTransformations = [biexTransformations];
          if (logTransformations && logTransformations.length > 0) {
            channelsInfo = channelsInfo.concat(
              parseChannels(logTransformations, "bi")
            );
          }
          if (linearTransformations && linearTransformations.length > 0) {
            channelsInfo = channelsInfo.concat(
              parseChannels(linearTransformations, "lin")
            );
          }
          if (biexTransformations && biexTransformations.length > 0) {
            channelsInfo = channelsInfo.concat(
              parseChannels(biexTransformations, "biex")
            );
          }
        }
        let fileObj = getFileOrSkipThisSample(
          filesUsed,
          channelsInfo,
          downloadedFiles
        );
        let fileId = fileObj.fileId;
        if (fileId) {
          filesUsed.push(fileId);
          let file = downloadedFiles.find((x: File) => x.id == fileId);
          let mainGraphAxis = sampleNode["Graph"]["Axis"];
          let xAxis = mainGraphAxis.find(
            (x: any) => x["_attributes"].dimension == "x"
          );
          let yAxis = mainGraphAxis.find(
            (x: any) => x["_attributes"].dimension == "y"
          );
          let xAxisName = xAxis["_attributes"].name;
          let yAxisName = yAxis["_attributes"].name;
          let xChannelInfo = channelsInfo.find(
            (x: any) => x.channelName == xAxisName
          );
          let yChannelInfo = channelsInfo.find(
            (x: any) => x.channelName == yAxisName
          );

          plot = createEmptyPlot();
          let fileXAxis = file.axes.filter((x: string) =>
            x.includes(xAxisName)
          )[0];
          let fileYAxis = file.axes.filter((x: string) =>
            x.includes(yAxisName)
          )[0];
          plot.xAxis = fileXAxis;
          plot.yAxis = fileYAxis;
          plot.xPlotType = xChannelInfo.type;
          plot.yPlotType = yChannelInfo.type;
          plot.ranges[PlotResource.getPlotAxisRangeString(plot, "x")] = [
            parseFloat(xChannelInfo.rangeMin),
            parseFloat(xChannelInfo.rangeMax),
          ];
          plot.ranges[PlotResource.getPlotAxisRangeString(plot, "y")] = [
            parseFloat(yChannelInfo.rangeMin),
            parseFloat(yChannelInfo.rangeMax),
          ];
          plot = addNewPlot(plots, plot, fileId, true);
          if (
            sampleNode["Subpopulations"] &&
            Object.keys(sampleNode["Subpopulations"]).length > 0
          ) {
            parseSubpopulation(
              plots,
              plot,
              fileId,
              sampleNode["Subpopulations"],
              channelsInfo
            );
          }
        } else {
          snackbarService.showSnackbar(
            "Clouldn't find matching file for flow jo sample " + sampleName,
            "warning"
          );
        }
      }
    }
    if (plots.length > 0) {
      WorkspaceDispatch.AddPlots(plots);
    }
  } catch (e) {
    snackbarService.showSnackbar("Could not parse FlowJo workspace", "warning");
  }
};

const parseChannels = (transformations: any, type: string) => {
  let channelArray = [];
  for (let i = 0; i < transformations.length; i++) {
    let transformationAttributes = transformations[i]["_attributes"];

    let rangeMin;
    let rangeMax;
    if (type == "biex") {
      rangeMin = "0";
      rangeMax = Math.pow(
        10,
        parseFloat(transformationAttributes["transforms:maxRange"])
      ).toString();
    } else if (type == "bi") {
      rangeMin = "0";
      rangeMax = Math.pow(
        10,
        parseFloat(transformationAttributes["transforms:decades"])
      ).toString();
    } else {
      rangeMin = transformationAttributes["transforms:minRange"];
      rangeMax = transformationAttributes["transforms:maxRange"];
    }
    let channelName =
      transformations[i]["data-type:parameter"]["_attributes"][
        "data-type:name"
      ];
    channelArray.push({
      channelName: channelName,
      rangeMin: rangeMin,
      rangeMax: rangeMax,
      type: type,
    });
  }
  return channelArray;
};

const addNewPlot = (
  plots: Array<Plot>,
  plot: Plot,
  fileID: string,
  populationCreate: boolean
) => {
  if (populationCreate) {
    let population: Population = createPopulation({ file: fileID });
    WorkspaceDispatch.AddPopulation(population);
    plot.population = population.id;
  }
  plot = createPlot({ clonePlot: plot });
  plots.push(plot);
  return plot;
};

const parseSubpopulation = async (
  plots: Array<Plot>,
  plot: Plot,
  fileId: string,
  subPopulation: any,
  channelsInfo: any
) => {
  try {
    let populations = subPopulation["Population"];
    let newPlotId: PlotID = "";
    if (populations) {
      if (populations.length == undefined) {
        populations = [populations];
      }

      for (let i = 0; i < populations.length; i++) {
        let newPlot: Plot;
        let population = populations[i];
        let graph = population["Graph"];
        let axis = graph["Axis"];
        let xAxis = axis.find((x: any) => x["_attributes"].dimension == "x");
        let yAxis = axis.find((x: any) => x["_attributes"].dimension == "y");
        let xAxisName = xAxis["_attributes"].name;
        let yAxisName = yAxis["_attributes"].name;
        let file = getFile(fileId);
        let fileXAxis = file.axes.filter((x: string) =>
          x.includes(xAxisName)
        )[0];
        let fileYAxis = file.axes.filter((x: string) =>
          x.includes(yAxisName)
        )[0];
        newPlot = createEmptyPlot();
        newPlot.xAxis = fileXAxis;
        newPlot.yAxis = fileYAxis;
        let xChannelInfo = channelsInfo.find(
          (x: any) => x.channelName == xAxisName
        );
        let yChannelInfo = channelsInfo.find(
          (x: any) => x.channelName == yAxisName
        );
        newPlot.xPlotType = xChannelInfo.type;

        newPlot.yPlotType = yChannelInfo.type;
        newPlot.ranges[PlotResource.getPlotAxisRangeString(plot, "x")] = [
          parseFloat(xChannelInfo.rangeMin),
          parseFloat(xChannelInfo.rangeMax),
        ];
        newPlot.ranges[PlotResource.getPlotAxisRangeString(plot, "y")] = [
          parseFloat(yChannelInfo.rangeMin),
          parseFloat(yChannelInfo.rangeMax),
        ];
        if (population["Gate"]) {
          let polygonGate: PolygonGate = {
            id: "",
            name: population["_attributes"].name,
            xAxis: fileXAxis, //`${xAxisName} - ${xAxisName}`,
            yAxis: fileYAxis, //`${yAxisName} - ${yAxisName}`,
            color: generateColor(),
            xAxisType: xChannelInfo.type,
            yAxisType: yChannelInfo.type,
            points: [],
            parents: [],
            children: [],
            xAxisOriginalRanges: [xChannelInfo.rangeMin, xChannelInfo.rangeMax],
            yAxisOriginalRanges: [yChannelInfo.rangeMin, yChannelInfo.rangeMax],
            gateType: "polygon",
          };
          polygonGate = createGate({ cloneGate: polygonGate });
          let gate = population["Gate"];
          let gateType = Object.keys(gate).filter((x) => x != "_attributes")[0];
          parseGateType(
            gateType,
            gate,
            polygonGate,
            xChannelInfo,
            yChannelInfo
          );
          plot.gates.push(polygonGate.id);
          WorkspaceDispatch.AddGate(polygonGate);

          let populationGate: PopulationGateType = {
            inverseGating: false,
            gate: polygonGate.id,
          };
          let childPopulation = createPopulation({ file: fileId });
          childPopulation.gates.push(populationGate);
          WorkspaceDispatch.AddPopulation(childPopulation);
          newPlot.population = childPopulation.id;

          newPlot = addNewPlot(plots, newPlot, fileId, false);
          if (population["Subpopulations"]) {
            parseSubpopulation(
              plots,
              newPlot,
              fileId,
              population["Subpopulations"],
              channelsInfo
            );
          }
        }
      }
    }
  } catch (e) {
    let index = plots.findIndex((x) => x.id == plot.id);
    plots.splice(index, 1);
    snackbarService.showSnackbar("Could not parse FlowJo workspace", "warning");
  }
};

const getRangeMinMaxIfPropertyNotThere = (
  attributes: any,
  property: string,
  returnValueIfPropertyNotFound: string
) => {
  if (property in attributes) {
    return attributes[property];
  }

  return returnValueIfPropertyNotFound;
};

const parseGateType = (
  gateType: string,
  gate: any,
  polygonGate: PolygonGate,
  xChannelInfo: any,
  yChannelInfo: any
) => {
  let gateDimensions: any;
  let xAxisDimension: any;
  let yAxisDimension: any;
  switch (gateType) {
    case COMMON_CONSTANTS.FLOW_JO.GATE_TYPE.RECTANGLE:
      let gateRectangle = gate[gateType];
      gateDimensions = gateRectangle["gating:dimension"];

      xAxisDimension = gateDimensions[0];
      yAxisDimension = gateDimensions[1];
      let xMax = getRangeMinMaxIfPropertyNotThere(
        xAxisDimension["_attributes"],
        "gating:max",
        xChannelInfo.rangeMax
      );
      let xMin = getRangeMinMaxIfPropertyNotThere(
        xAxisDimension["_attributes"],
        "gating:min",
        "0"
      );
      let yMax = getRangeMinMaxIfPropertyNotThere(
        yAxisDimension["_attributes"],
        "gating:max",
        yChannelInfo.rangeMax
      );
      let yMin = getRangeMinMaxIfPropertyNotThere(
        yAxisDimension["_attributes"],
        "gating:min",
        "0"
      );

      polygonGate.points.push({ x: xMin, y: yMin });
      polygonGate.points.push({ x: xMax, y: yMin });
      polygonGate.points.push({ x: xMax, y: yMax });
      polygonGate.points.push({ x: xMin, y: yMax });

      break;
    case COMMON_CONSTANTS.FLOW_JO.GATE_TYPE.ECLIPSE:
      break;
    case COMMON_CONSTANTS.FLOW_JO.GATE_TYPE.POLYGON:
      let gatePolygon = gate[gateType];

      gateDimensions = gatePolygon["gating:dimension"];

      let xAxisDimensionIndex = 0;
      let yAxisDimensionIndex = 1;

      xAxisDimension = gateDimensions[xAxisDimensionIndex];
      yAxisDimension = gateDimensions[yAxisDimensionIndex];
      let gateVertexs = gatePolygon["gating:vertex"];

      for (let i = 0; i < gateVertexs.length; i++) {
        let gateVertice = gateVertexs[i];
        let x =
          gateVertice["gating:coordinate"][xAxisDimensionIndex]["_attributes"][
            "data-type:value"
          ];
        let y =
          gateVertice["gating:coordinate"][yAxisDimensionIndex]["_attributes"][
            "data-type:value"
          ];
        polygonGate.points.push({ x: x, y: y });
      }

      break;
  }
};

export { ParseFlowJoJson };
