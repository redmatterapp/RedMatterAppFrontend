import React from "react";
//@ts-ignore
import { Responsive, WidthProvider } from "react-grid-layout";
import "./react-grid-layout-styles.css";
import PlotComponent from "../plots/PlotComponent";

import { Divider, MenuItem, Select } from "@material-ui/core";
import {
  getFile,
  getGate,
  getPopulation,
  getWorkspace,
} from "graph/utils/workspace";
import {
  FileID,
  Gate,
  Plot,
  PlotSpecificWorkspaceData,
  Workspace,
} from "graph/resources/types";
import WorkspaceDispatch from "graph/resources/dispatchers";
import { getPlotFile } from "graph/resources/plots";

const ResponsiveGridLayout = WidthProvider(Responsive);

const classes = {
  itemOuterDiv: {
    flex: 1,
    backgroundColor: "#eef",
    border: "solid 0.5px #bbb",
    boxShadow: "1px 3px 4px #bbd",
    borderRadius: 5,
    paddingBottom: "2rem",
  },
  itemInnerDiv: {
    width: "100%",
    height: "100%",
  },
};

let method = "file"; // TODO: sorry for this will be fixed later

interface PlotGroup {
  name: string;
  plots: Plot[];
}
const getPlotGroups = (plots: Plot[]): PlotGroup[] => {
  let plotGroups: PlotGroup[] = [];
  switch (method) {
    case "file":
      const plotByFileMap: { [index: string]: Plot[] } = {};
      for (const plot of plots) {
        try {
          const file = getPlotFile(plot);
          if (file.id in plotByFileMap) {
            plotByFileMap[file.id].push(plot);
          } else {
            plotByFileMap[file.id] = [plot];
          }
        } catch {
          console.error(
            "[PlotController] Plot has not been rendered due to population not found"
          );
        }
      }
      plotGroups = Object.keys(plotByFileMap).map((e) => {
        return {
          name: getFile(e).name,
          plots: plotByFileMap[e],
        } as PlotGroup;
      });
      break;
    case "gate":
      const plotByPopGateMap: { [index: string]: Plot[] } = {
        "No gates": [],
      };
      for (const plot of plots) {
        try {
          const pop = getPopulation(plot.population);
          if (pop.gates.length === 0) {
            plotByPopGateMap["No gates"].push(plot);
          } else if (pop.gates[0].gate in plotByPopGateMap) {
            plotByPopGateMap[pop.gates[0].gate].push(plot);
          } else {
            plotByPopGateMap[pop.gates[0].gate] = [plot];
          }
        } catch {
          console.error(
            "[PlotController] Plot has not been rendered due to population gate error"
          );
        }
      }
      if (plotByPopGateMap["No gates"].length === 0) {
        delete plotByPopGateMap["No gates"];
      }
      plotGroups = Object.keys(plotByPopGateMap).map((e) => {
        return {
          name: e === "No gates" ? e : getGate(e).name,
          plots: plotByPopGateMap[e],
        } as PlotGroup;
      });
      break;
    case "all":
      plotGroups = [{ name: "", plots: plots }];
      break;
    default:
      throw Error("wtf?");
  }
  return plotGroups;
};

export const getTargetLayoutPlots = (protoPlot: any): Plot[] => {
  let plotGroups: PlotGroup[] = getPlotGroups(getWorkspace().plots);
  try {
    const pop = getPopulation(protoPlot.population);
    switch (method) {
      case "file":
        const file = getFile(pop.file);
        return plotGroups.find((e) => e.name === file.id).plots;
      case "gate":
        let group = "No gates";
        //@ts-ignore
        if (pop.gates.length > 0) group = pop.gates[0].id;
        return plotGroups.find((e) => e.name === group).plots;
      case "all":
        return plotGroups[0].plots;
      default:
        throw Error("wtf?");
    }
  } catch {
    return [];
  }
};

export const MINW = 9;
export const MINH = 10;

export const resetPlotSizes = (id?: string) => {
  let tPlots = getWorkspace().plots.map((e) => e.id);
  if (id) tPlots = [id];
  for (const id of tPlots) {
    let docIdRef = document.getElementById(`canvas-${id}`);
    let docDisplayRef: any = document.getElementById(`display-ref-${id}`);
    let docBarRef: any = document.getElementById(`bar-ref-${id}`);

    if (docBarRef && docDisplayRef && docIdRef) {
      let width = docDisplayRef.offsetWidth - 55;
      let height = docDisplayRef.offsetHeight - docBarRef.offsetHeight - 40;
      docIdRef.setAttribute("style", `width:${width}px;height:${height}px;`);
    }
  }
};

export const setCanvasSize = (save: boolean = false) => {
  const plots = getWorkspace().plots;
  const updateList: Plot[] = [];
  for (let plot of plots) {
    let id = `canvas-${plot.id}`;
    let displayRef = `display-ref-${plot.id}`;
    let barRef = `bar-ref-${plot.id}`;

    let docIdRef = document.getElementById(id);
    let docDisplayRef: any = document.getElementById(displayRef);
    let docBarRef: any = document.getElementById(barRef);

    if (docBarRef && docDisplayRef && docIdRef) {
      let width = docDisplayRef.offsetWidth - 55;
      let height = docDisplayRef.offsetHeight - docBarRef.offsetHeight - 40;
      plot.plotHeight = height;
      plot.plotWidth = width;

      docIdRef.setAttribute("style", `width:${width}px;height:${height}px;`);
      updateList.push(plot);
    }
  }
  if (save && plots.length > 0) WorkspaceDispatch.UpdatePlots(updateList);
};

const standardGridPlotItem = (index: number, plotData: any, plots: Plot[]) => {
  let widthUsed = 0;
  let maxWidth = MINW * 4;
  for (let i = 0; i <= index; i++) {
    let plot = plots[i];
    if (index != i) widthUsed += plot.dimensions.w;
    let factor = maxWidth * ((i + 1) / 4) - widthUsed;
    if ((i + 1) % 4 == 0 && factor > 0) {
      widthUsed = widthUsed + factor;
    }
  }

  let x = plotData.positions.x;
  let y = plotData.positions.y;
  let w = plotData.dimensions.w;
  let h = plotData.dimensions.h;
  let newy = y;
  let newX = x;

  if (index > 0) {
    if (x == 0) {
      newy = widthUsed / maxWidth;
      if (newy >= 1) {
        newX = widthUsed - maxWidth * newy;
      } else newX = widthUsed;
    }
    if (y == 0) {
      newy = widthUsed / maxWidth;
    }
  }

  return {
    x: newX,
    y: newy,
    w: w,
    h: h,
    minW: MINW,
    minH: MINH,
    static: false,
  };
};

interface PlotControllerProps {
  sharedWorkspace: boolean;
  experimentId: string;
  workspace: Workspace;
  plotMoving?: boolean;
}

class PlotController extends React.Component<PlotControllerProps> {
  private static renderCalls = 0;

  constructor(props: PlotControllerProps) {
    super(props);
    this.state = {
      plots: props.workspace.plots,
      plotMoving: true,
    };
  }

  savePlotPosition(layouts: any) {
    let plots = this.props.workspace.plots;
    let plotChanges = [];
    for (let i = 0; i < layouts.length; i++) {
      let layout = layouts[i];
      let plotId = layouts[i].i;

      let plot = plots.find((x) => x.id === plotId);
      if (!plot) continue;
      if (
        plot.dimensions.h !== layout.h ||
        plot.dimensions.w !== layout.w ||
        plot.positions.x !== layout.x ||
        plot.positions.y !== layout.y
      ) {
        plot.dimensions = {
          h: layout.h,
          w: layout.w,
        };
        plot.positions = {
          x: layout.x,
          y: layout.y,
        };
        plotChanges.push(plot);
      }
    }
    WorkspaceDispatch.UpdatePlots(plotChanges);
  }

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.workspace.plots.length > this.props.workspace.plots.length) {
      setTimeout(() => setCanvasSize(true), 50);
    }
    this.setState(nextProps);
  }

  componentDidMount() {
    window.addEventListener("resize", () => {
      resetPlotSizes();
      setCanvasSize(true);
    });
    resetPlotSizes();
    setCanvasSize(true);
  }

  getPlotRelevantResources(plot: Plot) {
    const population = getPopulation(plot.population);
    const file = getFile(population.file);
    const gates: Gate[] = [
      ...plot.gates.map((e) => getGate(e)).filter((x) => x),
      ...population.gates.map((e) => getGate(e.gate)),
    ];
    const workspaceForPlot: PlotSpecificWorkspaceData = {
      file,
      gates,
      plot,
      population,
      key: plot.id,
    };
    return workspaceForPlot;
  }

  render() {
    const plotGroups = getPlotGroups(this.props.workspace.plots);
    if (this.props.workspace.plots.length > 0) {
      return (
        <div>
          <div
            style={{
              position: "fixed",
              right: 0,
              backgroundColor: "#fff",
              borderLeft: "solid 1px #ddd",
              borderBottom: "solid 1px #ddd",
              borderBottomLeftRadius: 5,
              padding: 3,
              zIndex: 1000,
            }}
          >
            Sort by:
            <Select
              style={{ marginLeft: 10 }}
              value={method}
              onChange={(e) => {
                //@ts-ignore
                method = e.target.value;
                this.forceUpdate();
              }}
            >
              <MenuItem value={"all"}>No sorting</MenuItem>
              <MenuItem value={"file"}>File</MenuItem>
              <MenuItem value={"gate"}>Gate</MenuItem>
            </Select>
          </div>

          <Divider></Divider>
          {plotGroups.map((plotGroup: PlotGroup) => {
            const name = plotGroup.name;
            const plots = plotGroup.plots;
            return (
              <div key={name}>
                {name.length > 0 ? (
                  <div
                    style={{
                      backgroundColor: "#6666AA",
                      paddingLeft: 20,
                      paddingBottom: 3,
                      paddingTop: 3,
                    }}
                  >
                    <h3 style={{ color: "white", marginBottom: 0 }}>{name}</h3>
                  </div>
                ) : null}
                <div style={{ marginTop: 3, marginBottom: 10 }}>
                  <ResponsiveGridLayout
                    className="layout"
                    breakpoints={{ lg: 1200 }}
                    cols={{ lg: 36 }}
                    rows={{ lg: 30 }}
                    rowHeight={30}
                    isDraggable={true}
                    onLayoutChange={(layout: any) => {
                      this.savePlotPosition(layout);
                    }}
                    onResize={(layout: any) => {
                      setCanvasSize(false);
                    }}
                    onResizeStop={(layout: any) => {
                      setCanvasSize(true);
                    }}
                  >
                    {
                      //@ts-ignore
                      plots.map((plot, i) => {
                        return (
                          <div
                            key={plot.id}
                            style={classes.itemOuterDiv}
                            data-grid={standardGridPlotItem(i, plot, plots)}
                            id={`workspace-outter-${plot.id}`}
                          >
                            <div id="inner" style={classes.itemInnerDiv}>
                              <PlotComponent
                                plotRelevantResources={this.getPlotRelevantResources(
                                  plot
                                )}
                                sharedWorkspace={this.props.sharedWorkspace}
                                experimentId={this.props.experimentId}
                              />
                            </div>
                          </div>
                        );
                      })
                    }
                  </ResponsiveGridLayout>
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div
          style={{
            textAlign: "center",
          }}
        >
          <h3 style={{ marginTop: 100, marginBottom: 10 }}>
            Click on "Plot sample" to visualize
          </h3>
          <h4 style={{ marginBottom: 70, color: "#777" }}>
            Create a plot from one of your samples to start your analysis
          </h4>
        </div>
      );
    }
  }
}

export default PlotController;
