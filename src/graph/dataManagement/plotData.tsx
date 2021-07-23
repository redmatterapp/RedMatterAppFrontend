/*
  This is supposed to store all data related to a single plot, including
  rendering params, so that it can be constructed, reconstructed and changed 
  easily.
*/

import staticFileReader from "graph/components/modals/staticFCSFiles/staticFileReader";
import dataManager from "./dataManager";
import FCSFile from "./fcsFile";
import Gate from "./gate/gate";
import ObserversFunctionality, {
  publishDecorator,
} from "./observersFunctionality";
import { generateColor } from "graph/utils/color";
import { COMMON_CONSTANTS } from "assets/constants/commonConstants";
import FCSServices from "services/FCSServices/FCSServices";

/* TypeScript does not deal well with decorators. Your linter might
   indicate a problem with this function but it does not exist */
const conditionalUpdateDecorator = () => {
  return function (
    target: PlotData,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      original.apply(this, args);
      //@ts-ignore
      this.conditionalUpdate();
    };
  };
};

const DEFAULT_COLOR = "#000";
const MAX_EVENT_SIZE = 100000;

export interface PlotDataState {
  id: string;
  ranges: Map<string, [number, number]>;
  linRanges: Map<string, [number, number]>;
  rangePlotType: Map<string, string>;
  file: FCSFile;
  gates: {
    gate: Gate;
    displayOnlyPointsInGate: boolean;
    inverseGating: boolean;
  }[];
  population: {
    gate: Gate;
    inverseGating: boolean;
  }[];
  xAxis: string;
  yAxis: string;
  positionInWorkspace: [number, number];
  plotWidth: number;
  plotHeight: number;
  plotScale: number;
  xPlotType: string;
  yPlotType: string;
  histogramAxis: "horizontal" | "vertical";
  label: string;
  dimensions: {
    w: number;
    h: number;
  };
  positions: {
    x: number;
    y: number;
  };
}

export default class PlotData extends ObserversFunctionality {
  static instaceCount: number = 1;

  readonly id: string;
  ranges: Map<string, [number, number]> = new Map();
  linearRanges: Map<string, [number, number]> = new Map();
  rangePlotType: Map<string, string> = new Map();
  file: FCSFile;
  gates: {
    displayOnlyPointsInGate: boolean;
    inverseGating: boolean;
    gate: Gate;
  }[] = [];
  population: {
    gate: Gate;
    inverseGating: boolean;
  }[] = [];
  xAxis: string = "";
  yAxis: string = "";
  yHistogram: boolean = false;
  xHistogram: boolean = false;
  positionInWorkspace: [number, number];
  plotWidth: number = 0;
  plotHeight: number = 0;
  plotScale: number = 2;
  xPlotType: string = "lin";
  yPlotType: string = "lin";
  histogramAxis: "horizontal" | "vertical" = "vertical";
  label: string = "";
  histogramOverlays: {
    color: string;
    plot: any;
    plotId: string;
    plotSource: string;
  }[] = [];
  histogramBarOverlays: {
    color: string;
    plot: any;
    plotId: string;
    plotSource: string;
  }[] = [];
  dimensions: {
    w: number;
    h: number;
  } = {
    w: 15,
    h: 18,
  };
  positions: {
    x: number;
    y: number;
  } = {
    x: -1,
    y: -1,
  };
  private changed: boolean = false;
  private randomSelection: number[] | null = null;

  /* PLOT DATA LIFETIME */

  constructor() {
    super();
    this.id = dataManager.createID();
  }

  setupPlot() {
    try {
      const fscssc = this.getFSCandSSCAxis();
      if (this.xAxis === "" && this.yAxis === "") {
        this.xAxis = this.file.axes[fscssc.fsc];
        this.yAxis = this.file.axes[fscssc.ssc];
      }
    } catch {}

    if (this.xAxis === "") this.xAxis = this.file.axes[0];
    if (this.yAxis === "") this.yAxis = this.file.axes[1];

    this.label = "Plot " + PlotData.instaceCount++;

    this.updateGateObservers();
    this.updateRandomSelection();
  }

  getFSCandSSCAxis(): { fsc: number; ssc: number } {
    let hasFSC: null | number = null;
    let hasSSC: null | number = null;
    for (
      let i = 0;
      i < this.file.axes.length && (hasFSC === null || hasSSC === null);
      i++
    ) {
      const axis = this.file.axes[i];
      if (axis.toUpperCase().indexOf("FSC") != -1) {
        hasFSC = i;
      } else if (axis.toUpperCase().indexOf("SSC") != -1) {
        hasSSC = i;
      }
    }
    if (hasSSC === null || hasFSC === null) {
      throw Error("FSC or SSC axis not found");
    }
    return { fsc: hasFSC, ssc: hasSSC };
  }

  getOverlays() {
    return this.histogramOverlays.map((e: any) => {
      return {
        plot: dataManager.getPlot(e.plot),
        color: e.color,
      };
    });
  }

  private updateRandomSelection() {
    const pointCount = this.getXandYData().xAxis.length;
    const axisCount = this.file.axes.length;
    if (pointCount * axisCount > MAX_EVENT_SIZE) {
      const selectedPointsCount = Math.round(MAX_EVENT_SIZE / axisCount);
      let permutation = Array(pointCount)
        .fill(0)
        .map((_, i) => i);
      for (let i = 0; i < pointCount; i++) {
        const temp = permutation[i];
        const rnd = Math.round(Math.random() * pointCount);
        permutation[i] = permutation[rnd];
        permutation[rnd] = temp;
      }
      this.randomSelection = permutation.filter(
        (_, i) => i < selectedPointsCount
      );
    } else this.randomSelection = null;
    this.axisDataCache = null;
  }

  private filterIndexesFromRandomSelection(arr: any[]) {
    if (this.randomSelection === null) return arr;
    return this.randomSelection.map((e) => arr[e]);
  }

  export(): string {
    const state: any = this.getState();
    state.file = "local://" + state.file.name;
    return JSON.stringify(state);
  }

  import(plotJSON: string) {
    const plot = JSON.parse(plotJSON);
    if (plot.file.split("://")[0] === "local") {
      const file = staticFileReader(plot.file.split("://")[1]);
      const id = dataManager.addNewFileToWorkspace(file);
      plot.file = dataManager.getFile(id);
    }
    this.setState(plot);
  }

  /* Every new update should result in this function being called,
     this is the function to be observed, as it is called when new
     updates happen. */
  @publishDecorator()
  plotUpdated() {
    this.changed = false;
  }

  private conditionalUpdate() {
    if (this.changed) {
      this.plotUpdated();
    }
  }

  getState(): PlotDataState {
    return {
      id: this.id,
      label: this.label,
      ranges: this.ranges,
      file: this.file,
      gates: this.gates,
      population: this.population,
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      positionInWorkspace: this.positionInWorkspace,
      plotWidth: this.plotHeight,
      plotHeight: this.plotWidth,
      plotScale: this.plotScale,
      xPlotType: this.xPlotType,
      yPlotType: this.yPlotType,
      histogramAxis: this.histogramAxis,
      dimensions: this.dimensions,
      positions: this.positions,
      linRanges: this.linearRanges,
      rangePlotType: this.rangePlotType,
    };
  }

  setState(state: PlotDataState) {
    if (state.label !== undefined) this.label = state.label;
    if (state.ranges !== undefined) this.ranges = state.ranges;
    if (state.file !== undefined) this.file = state.file;
    if (state.gates !== undefined) this.gates = state.gates;
    if (state.population !== undefined) this.population = state.population;
    if (state.xAxis !== undefined) this.xAxis = state.xAxis;
    if (state.yAxis !== undefined) this.yAxis = state.yAxis;
    if (state.positionInWorkspace !== undefined)
      this.positionInWorkspace = state.positionInWorkspace;
    if (state.plotWidth !== undefined) this.plotWidth = state.plotHeight;
    if (state.plotHeight !== undefined) this.plotHeight = state.plotHeight;
    if (state.plotScale !== undefined) this.plotScale = state.plotScale;
    if (state.xPlotType !== undefined) this.xPlotType = state.xPlotType;
    if (state.yPlotType !== undefined) this.yPlotType = state.yPlotType;
    if (state.histogramAxis !== undefined)
      this.histogramAxis = state.histogramAxis;
    if (state.dimensions !== undefined) this.dimensions = state.dimensions;
    if (state.positions !== undefined) this.positions = state.positions;
    if (state.linRanges) this.linearRanges = state.linRanges;
    if (state.rangePlotType) this.rangePlotType = state.rangePlotType;
  }

  update(state: any) {
    if (state.label !== undefined) this.label = state.label;
    this.plotUpdated();
  }

  /* MULTI PLOT INTERACTION */

  addOverlay(
    plotData: PlotData,
    color?: string,
    plotId?: string,
    plotSource?: string
  ) {
    if (!color) color = generateColor();
    this.histogramOverlays.push({
      plot: COMMON_CONSTANTS.FILE == plotSource ? plotData : {},
      color: color,
      plotId: plotId,
      plotSource: plotSource,
    });
    this.plotUpdated();
    this.initiateAutoSave();
  }

  initiateAutoSave() {
    if (dataManager.letUpdateBeCalledForAutoSave)
      dataManager.workspaceUpdated();
  }

  addBarOverlay(
    plotData: PlotData,
    color?: string,
    plotId?: string,
    plotSource?: string
  ) {
    if (!color) color = generateColor();
    this.histogramBarOverlays.push({
      plot: COMMON_CONSTANTS.FILE == plotSource ? plotData : {},
      color: color,
      plotId: plotId,
      plotSource: plotSource,
    });
    this.plotUpdated();
    this.initiateAutoSave();
  }

  removeBarOverlay(ploDataID: string) {
    this.histogramBarOverlays = this.histogramBarOverlays.filter(
      (x) => x.plotId != ploDataID
    );
    this.plotUpdated();
    this.initiateAutoSave();
  }

  removeAnyOverlay(ploDataID: string) {
    this.histogramBarOverlays = this.histogramBarOverlays.filter(
      (x) => x.plotId != ploDataID
    );
    this.histogramOverlays = this.histogramOverlays.filter(
      (x) => x.plotId != ploDataID
    );
    this.plotUpdated();
    this.initiateAutoSave();
  }

  removeOverlay(plotDataID: string) {
    this.histogramOverlays = this.histogramOverlays.filter(
      (e) => e.plotId != plotDataID
    );
    this.plotUpdated();
    this.initiateAutoSave();
  }

  createSubpop(inverse: boolean = false) {
    const newGates = this.gates.map((e) => {
      return {
        gate: e.gate,
        inverseGating: inverse,
      };
    });
    const newPlotData = new PlotData();
    newPlotData.setState(this.getState());
    newPlotData.population = [...newGates, ...this.population];
    newPlotData.gates = [];
    return dataManager.addNewPlotToWorkspace(newPlotData);
  }

  /* ALTER PLOT STATE */

  @publishDecorator()
  addGate(gate: Gate, forceGatedPoints: boolean = false) {
    const gateQuery = this.gates.filter((g) => g.gate.id === gate.id);
    if (gateQuery.length > 0) {
      throw Error(
        "Adding the same gate with ID = " + gate.id + " twice to plot"
      );
    }
    this.gates.push({
      gate: gate,
      displayOnlyPointsInGate: forceGatedPoints,
      inverseGating: false,
    });

    this.axisDataCache = null;
    this.updateGateObservers();
    this.updateRandomSelection();

    this.plotUpdated();
  }

  @publishDecorator()
  removeGate(gate: Gate) {
    const gateQuery = this.gates.filter((g) => g.gate.id === gate.id);
    if (gateQuery.length !== 1) {
      if (gateQuery.length < 1)
        throw Error("Gate with ID = " + gate.id + " was not found");
      if (gateQuery.length > 1) {
        throw Error("Multiple gates with ID = " + gate.id + " were found");
      }
    }
    this.gates = this.gates.filter((g) => g.gate.id !== gate.id);

    this.axisDataCache = null;
    this.updateGateObservers();
    this.updateRandomSelection();

    this.plotUpdated();
  }

  getGates(): Gate[] {
    return this.gates.map((e) => e.gate);
  }

  @conditionalUpdateDecorator()
  setWidthAndHeight(w: number, h: number) {
    this.changed = this.changed || this.plotWidth != w || this.plotHeight != h;
    this.plotWidth = w - 40;
    this.plotHeight = h - 30;
  }

  @conditionalUpdateDecorator()
  setXAxisPlotType(plotType: string) {
    this.changed = this.changed || this.xPlotType !== plotType;
    this.xPlotType = plotType;
  }

  @conditionalUpdateDecorator()
  setYAxisPlotType(plotType: string) {
    this.changed = this.changed || this.yPlotType !== plotType;
    this.yPlotType = plotType;
  }

  @conditionalUpdateDecorator()
  xAxisToHistogram() {
    this.changed = this.changed || this.yAxis !== this.xAxis;
    this.yAxis = this.xAxis;
    this.xHistogram = true;
    this.histogramAxis = "vertical";
  }

  @conditionalUpdateDecorator()
  yAxisToHistogram() {
    this.changed = this.changed || this.yAxis !== this.xAxis;
    this.xAxis = this.yAxis;
    this.yHistogram = true;
    this.histogramAxis = "horizontal";
  }

  @conditionalUpdateDecorator()
  setXAxis(xAxis: string) {
    this.changed = this.changed || xAxis !== this.xAxis;
    this.xAxis = xAxis;
    this.xPlotType = this.rangePlotType.get(xAxis);
  }

  @conditionalUpdateDecorator()
  setYAxis(yAxis: string) {
    this.changed = this.changed || yAxis !== this.yAxis;
    this.yAxis = yAxis;
    this.yPlotType = this.rangePlotType.get(yAxis);
  }

  @conditionalUpdateDecorator()
  disableHistogram(axis: "x" | "y") {
    if (axis === "x") this.xHistogram = false;
    else this.yHistogram = false;
  }

  /* PLOT STATE GETTERS */

  getPointColors() {
    const allData = this.getAxesData(false);
    const colors: string[] = [];
    const isPointInside = (gate: any, point: number[]): boolean => {
      const p = {
        x: point[gate.gate.xAxis],
        y: point[gate.gate.yAxis],
      };
      return gate.gate.isPointInside(p, this)
        ? !gate.inverseGating
        : gate.inverseGating;
    };
    const gateDFS = (
      point: number[],
      gate: any,
      currentDepth: number
    ): { depth: number; color: string | null } => {
      if (!isPointInside(gate, point)) {
        return { depth: 0, color: null };
      }
      let ans = { depth: currentDepth, color: gate.gate.color };
      for (const child of gate.gate.children) {
        const cAns = gateDFS(
          point,
          { gate: child, inverseGating: false },
          currentDepth + 1
        );
        if (cAns.color !== null && cAns.depth > ans.depth) {
          ans = cAns;
        }
      }
      return ans;
    };
    const default_color =
      this.population.length === 0
        ? DEFAULT_COLOR
        : this.population[0].gate.color;
    for (let i = 0; i < allData.length; i++) {
      let ans = { depth: 0, color: default_color };
      for (const gate of this.gates) {
        const cAns = gateDFS(allData[i], gate, 1);
        if (cAns.color !== null && cAns.depth > ans.depth) {
          ans = cAns;
        }
      }
      colors.push(ans.color);
    }
    return colors;
  }

  getXAxisName() {
    return this.xAxis;
  }

  getYAxisName() {
    return this.yAxis;
  }

  getXandYData(
    targetXAxis?: string,
    targetYAxis?: string
  ): { xAxis: number[]; yAxis: number[] } {
    const xAxisName = targetXAxis !== undefined ? targetXAxis : this.xAxis;
    const yAxisName = targetYAxis !== undefined ? targetYAxis : this.yAxis;
    let xAxis: number[] = [];
    let yAxis: number[] = [];
    this.getAxesData().forEach((e) => {
      xAxis.push(e[xAxisName]);
      yAxis.push(e[yAxisName]);
    });

    return { xAxis, yAxis };
  }

  getAxis(targetAxis: string): number[] {
    const data: number[] = [];
    this.getAxesData().forEach((e) => {
      data.push(e[targetAxis]);
    });
    return data;
  }

  getXandYRanges(
    targetXAxis?: string,
    targetYAxis?: string
  ): { x: [number, number]; y: [number, number] } {
    targetXAxis = targetXAxis === undefined ? this.xAxis : targetXAxis;
    targetYAxis = targetYAxis === undefined ? this.yAxis : targetYAxis;
    if (
      this.ranges.constructor.name !== "Map" ||
      !this.ranges.has(targetXAxis) ||
      !this.ranges.has(targetYAxis)
    ) {
      this.findAllRanges();
    }
    return {
      x: this.ranges.get(targetXAxis),
      y: this.ranges.get(targetYAxis),
    };
  }

  private STD_BIN_SIZE = 50;
  getBins(binCount?: number, targetAxis?: string) {
    binCount = binCount === undefined ? this.getBinCount() : binCount;
    const axisName =
      targetAxis === undefined
        ? this.histogramAxis === "vertical"
          ? this.xAxis
          : this.yAxis
        : targetAxis;
    let range = this.ranges.get(axisName);
    let axis = this.getAxis(axisName);
    if (
      (this.xAxis === axisName && this.xPlotType === "bi") ||
      (this.yAxis === axisName && this.yPlotType === "bi")
    ) {
      const fcsServices = new FCSServices();
      const linearRange = this.linearRanges.get(axisName);
      axis = fcsServices.logicleMarkTransformer(
        [...axis],
        linearRange[0],
        linearRange[1]
      );
      range = [0, 1];
    }
    const binCounts = Array(binCount).fill(0);
    const step = (range[1] - range[0]) / binCount;
    let mx = 0;
    for (let i = 0; i < axis.length; i++) {
      const index = Math.floor((axis[i] - range[0]) / step);
      binCounts[index]++;
      if (binCounts[index] > mx) mx = binCounts[index];
    }
    return { list: binCounts, max: mx };
  }

  private getBinCount() {
    return this.histogramAxis === "horizontal"
      ? this.plotWidth / this.STD_BIN_SIZE
      : this.plotHeight / this.STD_BIN_SIZE;
  }

  private axisDataCache: null | any[] = null;
  getAxesData(filterGating: boolean = true): any[] {
    if (this.axisDataCache) return this.axisDataCache;
    let dataAxes: any = {};
    let size;
    for (const axis of this.file.axes) {
      dataAxes[axis] = this.getAxisData(axis);
      if (size !== undefined && dataAxes[axis].length !== size) {
        throw Error("Axes of different size were found");
      } else if (size === undefined) size = dataAxes[axis].length;
    }
    let data = Array(size)
      .fill(0)
      .map((_, i) => {
        const obj: any = {};
        for (const axis of this.file.axes) {
          obj[axis] = dataAxes[axis][i];
        }
        return obj;
      });
    if (filterGating) {
      for (const gate of this.gates) {
        if (gate.displayOnlyPointsInGate) {
          const x = gate.gate.xAxis;
          const y = gate.gate.yAxis;
          data = data.filter((e: any) => {
            const inside = gate.gate.isPointInside({ x: e[x], y: e[y] }, this);
            return gate.inverseGating ? !inside : inside;
          });
        }
      }
    }
    for (const gate of this.population) {
      const x = gate.gate.xAxis;
      const y = gate.gate.yAxis;
      data = data.filter((e: any) => {
        const inside = gate.gate.isPointInside({ x: e[x], y: e[y] }, this);
        return gate.inverseGating ? !inside : inside;
      });
    }
    // data = this.filterIndexesFromRandomSelection(data);
    return (this.axisDataCache = data);
  }

  private gateObservers: { observerID: string; targetGateID: string }[] = [];
  private popObservers: { observerID: string; targetGateID: string }[] = [];
  private updateGateObservers() {
    let gateIds = this.gates.map((obj) => obj.gate.id);
    let obsIds = this.gateObservers.map((obj) => obj.targetGateID);
    let toAdd = gateIds.filter((g) => !obsIds.includes(g));
    let toRemove = obsIds.filter((g) => !gateIds.includes(g));

    toAdd.forEach((e) => {
      const obsID = dataManager.getGate(e).addObserver("update", () => {
        this.plotUpdated();
      });
      this.gateObservers.push({ observerID: obsID, targetGateID: e });
    });
    toRemove.forEach((e) => {
      dataManager
        .getGate(e)
        .removeObserver(
          "update",
          this.gateObservers.filter((g) => g.targetGateID === e)[0].observerID
        );
      this.gateObservers = this.gateObservers.filter(
        (g) => g.targetGateID != e
      );
    });
    gateIds = this.population.map((obj) => obj.gate.id);
    obsIds = this.popObservers.map((obj) => obj.targetGateID);
    toAdd = gateIds.filter((g) => !obsIds.includes(g));
    toRemove = obsIds.filter((g) => !gateIds.includes(g));
    toAdd.forEach((e) => {
      const obsID = dataManager.getGate(e).addObserver("update", () => {
        this.plotUpdated();
        this.axisDataCache = null;
      });
      this.popObservers.push({ observerID: obsID, targetGateID: e });
    });
    toRemove.forEach((e) => {
      dataManager
        .getGate(e)
        .removeObserver(
          "update",
          this.popObservers.filter((g) => g.targetGateID === e)[0].observerID
        );
      this.popObservers = this.popObservers.filter((g) => g.targetGateID === e);
    });
  }

  private getAxisData(axis: string): number[] {
    return this.file.getAxisPoints(axis);
  }

  private findAllRanges() {
    if (!(this.ranges instanceof Map)) {
      this.ranges = new Map();
    }
    if (this.file.axes.map((e) => this.ranges.has(e)).every((e) => e)) return;
    if (
      this.file.remoteData != undefined &&
      this.file.remoteData.paramsAnalysis !== undefined
    ) {
      //@ts-ignore
      Object.values(this.file.remoteData.paramsAnalysis).forEach((axis, i) => {
        const axisType =
          this.file.remoteData.channels[i].display !== "bi"
            ? "linear"
            : "biexponential";

        this.rangePlotType = new Map();
        this.rangePlotType.set(
          //@ts-ignore
          axis.paramName,
          axisType === "linear" ? "lin" : "bi"
        );
        const min =
          //@ts-ignore
          axis[axisType + "Minimum"];
        const max =
          //@ts-ignore
          axis[axisType + "Maximum"];
        //@ts-ignore
        this.ranges.set(axis.paramName, [min, max]);
        //@ts-ignore
        this.linearRanges.set(axis.paramName, [min, max]);
      });
    } else {
      const axesData = this.getAxesData();
      for (const axis of this.file.axes) {
        if (this.ranges.has(axis)) continue;
        this.rangePlotType.set(axis, "lin");
        const data = axesData.map((e) => e[axis]);
        this.ranges.set(axis, this.findRangeBoundries(data));
        this.linearRanges.set(axis, this.findRangeBoundries(data));
      }
    }
  }

  findRangeBoundries(axisData: number[]): [number, number] {
    let min = axisData[0],
      max = axisData[0];
    for (const p of axisData) {
      min = Math.min(p, min);
      max = Math.max(p, max);
    }
    const d = Math.max(max - min, 1e-10);
    return [min, max];
  }
}
