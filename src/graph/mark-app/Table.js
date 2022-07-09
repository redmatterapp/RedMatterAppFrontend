import { useEffect, useState, useRef } from "react";
import Plot from "./Plot";
import Histogram from "./Histogram";
import upArrow from "assets/images/up_arrow.png";
import downArrow from "assets/images/down_arrow.png";
import { Button } from "@material-ui/core";

import Draggable from "plain-draggable";
import LeaderLine from "react-leader-line";
import { Resizable } from "re-resizable";

// import { PlainDraggable } from "plain-draggable";

import { DSC_SORT, ASC_SORT } from "./Helper";
import { Tooltip } from "@material-ui/core";
import { CodeOutlined } from "@ant-design/icons";

let getNumberOfPlots = (plotObject, nodes) => {
  let count = 0;
  let countLine = (plot) => {
    if (plot) {
      count++;

      if (plot.gates) {
        plot.gates?.map((p) => {
          countLine(p.plot);
        });
      }
    }
  };

  countLine(plotObject);

  return count;
};

let getLines = (els, draggables, lines, plots) => {
  let count = 0;
  let index = 0;
  let linesArr = [];

  // const line1 = new LeaderLine(el1, el2, {
  //   color: "black",
  //   size: 3,
  //   middleLabel: "/data/topic",
  //   dash: { animation: true },
  //   startPlug: "disc",
  //   endPlug: "square",
  //   // path: 'grid'
  // });

  plots.map((plot, index) => {
    if (plot.gates) {
      plot.gates.map((gate, index) => {
        let el1 = els.find((el) => el.id == plot.population);
        let el2 = els.find((el) => el.id == gate.name);

        const line = new LeaderLine(el1, el2, {
          color: "black",
          size: 3,
          // dash: { animation: true },
          startPlug: "disc",
          endPlug: "arrow1",
          path: "grid",
        });

        linesArr.push(line);

        lines.current.push(line);
      });
    } else {
    }

    // it has gates so need to add lines to the draggable
    draggables.current[index].onMove = function () {
      linesArr?.forEach((l) => {
        l.position();
      });
    };
  });
};

function Table(props) {
  let nodes = useRef([]);

  const draggables = useRef([]);
  const lines = useRef([]);

  useEffect(() => {
    let els = [];
    let draggableObjects = [];
    let levels = [];

    let controlEnrichedFile = props.enrichedFiles.find(
      (enrichedFile) => enrichedFile.isControlFile
    );

    controlEnrichedFile.plots.map((plot, index) => {
      const el = nodes.current[index].resizable;
      els.push(el);

      let level = plot.level;
      levels.push(level);
      let levelCount = levels.filter(function (value) {
        return value === level;
      }).length;

      let left = 450 * level;
      let top = 450 * (levelCount - 1);

      console.log("plotn is ", plot);
      console.log("left, top is ", left, top);

      const draggable = new Draggable(el, {
        left: left,
        top: top,
        handle: el.children[0],
        //endSocket: "right",
        onMove: () => {
          //line1.position();
        },
      });

      draggables.current.push(draggable);
    });

    getLines(els, draggables, lines, controlEnrichedFile.plots);
  }, []);

  const handleResize = () => {
    lines.current.forEach((line) => {
      line.position();
    });
  };

  let nonControlEnrichedFiles = props.enrichedFiles.filter(
    (enrichedFile) => !enrichedFile.isControlFile
  );

  // let editedFiles = getWorkspace().workspaceState?.files;
  // let editedFileIds = Object.keys(editedFiles);

  let allFileMinObj = props.enrichedFiles.map((enrichedFile) => {
    return { id: enrichedFile.fileId, name: enrichedFile.label };
  });
  const [shouldFileRender, setShouldFileRender] = useState(
    props.workspaceState?.openFiles || []
  );

  const fileViewHideHandler = (fileId) => {
    if (shouldFileRender.includes(fileId)) {
      setShouldFileRender((prev) => prev.filter((item) => item !== fileId));
    } else {
      setShouldFileRender((prev) => [...prev, fileId]);
    }
    //setTimeout(() => WorkspaceDispatch.UpdateOpenFiles(fileId, false), 0);
  };

  const tableRef = useRef(null);

  useEffect(() => {
    setShouldFileRender(props.workspaceState.openFiles || []);
    if (props.workspaceState.sortingState?.sortingState) {
      props.sortByGate(
        props.workspaceState.sortingState?.gateName,
        props.workspaceState.sortingState?.sortingState
      );
    } else {
      // const files = props.workspaceState.files;
      // const newFiles = [];
      // for (const id of props.workspaceState.fileIds) {
      //   newFiles.push(files.find((file) => file.id === id));
      // }
      // WorkspaceDispatch.SetFiles(newFiles);
    }
  }, []);

  // useEffect(() => {
  //   tableRef.current.scrollBy({
  //     top: 0,
  //     left: +500,
  //     behavior: "smooth",
  //   });
  // }, [controlEnrichedFile?.plots?.length]);

  let controlEnrichedFile = props.enrichedFiles.find(
    (enrichedFile) => enrichedFile.isControlFile
  );

  const renderPlots = (plotObject) => {
    if (plotObject) {
      return (
        <>
          <div>{plotObject.population}</div>
        </>
      );
    }

    {
      plotObject.gates.map((gate, gateIndex) => {
        plotObject(gate.plot);
      });
    }
  };

  function PlotRender({ plots: plots, node: node }) {
    return (
      <div
        style={{
          width: 1600,
          height: 1600,
        }}
      >
        {plots?.map((plot, plotIindex) => {
          return (
            <Resizable
              ref={(element) => {
                return nodes.current.push(element);
              }}
              className="node"
              onResize={handleResize}
              id={plot.population}
              key={"resizable-plot-" + plotIindex}
            >
              <div>Drag Me</div>
              <Plot
                name="control-file"
                key={`plot-${plotIindex}`}
                plot={plot}
                enrichedFile={controlEnrichedFile}
                workspaceState={props.workspaceState}
                onAddGate={props.onAddGate}
                onDeleteGate={props.onDeleteGate}
                onEditGate={props.onEditGate}
                onResize={props.onResize}
                onChangeChannel={props.onChangeChannel}
                plotIndex={`0-${plotIindex}`}
                downloadPlotAsImage={props.downloadPlotAsImage}
                testParam={props.testParam}
              />
            </Resizable>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          color: "#fff",
          backgroundColor: "#66ccff",
          fontWeight: "bold",
          display: "flex",
          paddingLeft: "10px",
        }}
      >
        <div
          style={{
            width: "20%",
            order: 1,
          }}
        ></div>
        <div
          style={{
            width: "60%",
            order: 2,
            textAlign: "center",
          }}
        >
          CONTROL FILE
        </div>
        <div
          style={{
            width: "20%",
            order: 3,
          }}
        ></div>
      </div>
      Render Plots:
      {PlotRender({
        plots: controlEnrichedFile.plots,
      })}
      {/* <table
        style={{
          maxWidth: "100%",
          overflowX: "auto",
          scrollBhavior: "smooth",
          display: "block",
        }}
        className="workspace"
        ref={tableRef}
      >
        <tbody>
          <tr>
            {controlEnrichedFile?.plots?.map((plot, plotIindex) => {
              return (
                <th
                  id={`entire-canvas-0-${plotIindex}`}
                  key={`td-${plotIindex}`}
                >
                  <Tooltip
                    title={
                      plot.population === "All" &&
                      controlEnrichedFile?.label.length > 21
                        ? controlEnrichedFile?.label
                        : ""
                    }
                  >
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        maxWidth: plot.width,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textAlign: "center",
                        fontWeight: "bold",
                        margin: "auto",
                      }}
                    >
                      {plot.population !== "All"
                        ? `${controlEnrichedFile?.gateStats
                            .filter((gateStat) => {
                              return gateStat.gateName === plot.population;
                            })
                            .map((gateStat) => {
                              return gateStat && gateStat.percentage;
                            })}%`
                        : controlEnrichedFile?.label}
                    </div>
                  </Tooltip>

                  <span
                    style={{
                      fontSize: "10px",
                    }}
                  >
                    {plot.population === "All"
                      ? "" +
                        controlEnrichedFile.enrichedEvents.length +
                        " events"
                      : ""}
                  </span>

                  {(() => {
                    if (plot?.plotType === "scatter") {
                      return (
                        <Plot
                          name="control-file"
                          key={`plot-${plotIindex}`}
                          plot={plot}
                          enrichedFile={controlEnrichedFile}
                          workspaceState={props.workspaceState}
                          onAddGate={props.onAddGate}
                          onDeleteGate={props.onDeleteGate}
                          onEditGate={props.onEditGate}
                          onResize={props.onResize}
                          onChangeChannel={props.onChangeChannel}
                          plotIndex={`0-${plotIindex}`}
                          downloadPlotAsImage={props.downloadPlotAsImage}
                          testParam={props.testParam}
                        />
                      );
                    } else if (plot?.plotType === "histogram") {
                      let enrichedOverlayFiles;
                      if (plot.overlays && plot.overlays.length > 0) {
                        enrichedOverlayFiles = props.enrichedFiles.filter(
                          (enrichedFile) => {
                            //
                            return (
                              plot.overlays.findIndex(
                                (x) => x.id == enrichedFile.fileId
                              ) > -1
                            );
                          }
                        );
                      }
                      return (
                        <Histogram
                          key={`plot-${plotIindex}`}
                          plot={plot}
                          onChangeChannel={props.onChangeChannel}
                          onAddGate={props.onAddGate}
                          addOverlay={props.addOverlay}
                          onDeleteGate={props.onDeleteGate}
                          onEditGate={props.onEditGate}
                          enrichedFile={controlEnrichedFile}
                          workspaceState={props.workspaceState}
                          enrichedOverlayFiles={enrichedOverlayFiles}
                          allFileMinObj={allFileMinObj}
                          plotIndex={`0-${plotIindex}`}
                          downloadPlotAsImage={props.downloadPlotAsImage}
                        />
                      );
                    }
                  })()}
                </th>
              );
            })}
          </tr>
          <tr>
            <td colSpan="100">
              <div
                style={{
                  color: "#000",
                  backgroundColor: "#ffff99",
                  textAlign: "center",
                  fontWeight: "bold",
                  marginBottom: 5,
                  border: "1px solid #000",
                }}
              >
                OTHER FILES
              </div>
            </td>
          </tr>
          <tr>
            {controlEnrichedFile.plots.map((plot, plotIindex) => {
              return (
                <td
                  key={`td-population-sorter-${plotIindex}`}
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    minWidth: plot.width + 170,
                    padding: 5,
                    margin: 0.5,
                    border: "1px solid gray",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "10px",
                        backgroundColor: `${
                          plotIindex > 0
                            ? controlEnrichedFile.plots[plotIindex - 1].gate
                                .color
                            : "#000000"
                        }`,
                        width: "15px",
                        height: "15px",
                      }}
                    ></div>
                    <div>
                      {plot.population}
                      <img
                        onClick={() => {
                          props.sortByGate(plot.population, ASC_SORT);
                        }}
                        src={downArrow}
                        alt="down-arrow"
                        style={{
                          width: 10,
                          marginLeft: 5,
                          cursor: "pointer",
                        }}
                      />
                      <img
                        onClick={() => {
                          props.sortByGate(plot.population, DSC_SORT);
                        }}
                        src={upArrow}
                        alt="up-arrow"
                        style={{
                          width: 10,
                          marginLeft: 5,
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                </td>
              );
            })}
          </tr>
          {nonControlEnrichedFiles.map((enrichedFile, fileIndex) => {
            // LOOPING THROUGH NON-CONTROL FILES
            return (
              <tr key={`tr-${fileIndex}`}>
                {enrichedFile.plots.map((plot, plotIindex) => {
                  return (
                    <td
                      key={`td-${plotIindex + 1}`}
                      id={`entire-canvas-${fileIndex + 1}-${plotIindex}`}
                      style={{
                        margin: 0.5,
                        border: "1px solid gray",
                        minWidth: plot.width + 170,
                      }}
                    >
                      <div
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        <Tooltip
                          title={
                            plot.population === "All" &&
                            enrichedFile?.label.length > 21
                              ? enrichedFile?.label
                              : ""
                          }
                        >
                          <div
                            style={{
                              whiteSpace: "nowrap",
                              maxWidth: plot.width,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              textAlign: "center",
                              fontWeight: "bold",
                              margin: "auto",
                            }}
                          >
                            {plot.population !== "All"
                              ? `${enrichedFile.gateStats
                                  .filter((gateStat) => {
                                    return (
                                      gateStat.gateName === plot.population
                                    );
                                  })

                                  .map((gateStat) => {
                                    return gateStat && gateStat.percentage;
                                  })}%`
                              : enrichedFile.label}
                          </div>
                        </Tooltip>

                        <span
                          style={{
                            fontSize: "10px",
                          }}
                        >
                          {plot.population === "All"
                            ? "" +
                              enrichedFile.enrichedEvents.length +
                              " events"
                            : ""}
                        </span>
                      </div>
                      {shouldFileRender.includes(enrichedFile?.fileId) &&
                        (() => {
                          if (plot.plotType === "scatter") {
                            return (
                              <Plot
                                name="non-control-file"
                                key={`plot-${plotIindex + 1}`}
                                plot={plot}
                                enrichedFile={enrichedFile}
                                workspaceState={props.workspaceState}
                                onAddGate={props.onAddGate}
                                onEditGate={props.onEditGate}
                                onResize={props.onResize}
                                onChangeChannel={props.onChangeChannel}
                                plotIndex={`${fileIndex + 1}-${plotIindex}`}
                                testParam={props.testParam}
                                downloadPlotAsImage={props.downloadPlotAsImage}
                              />
                            );
                          } else if (plot.plotType === "histogram") {
                            let enrichedOverlayFiles;
                            if (plot.overlays && plot.overlays.length > 0) {
                              enrichedOverlayFiles = props.enrichedFiles.filter(
                                (enrichedFile) => {
                                  //
                                  return (
                                    plot.overlays.findIndex(
                                      (x) => x.id == enrichedFile.fileId
                                    ) > -1
                                  );
                                }
                              );
                            }
                            return (
                              <Histogram
                                key={`plot-${plotIindex + 1}`}
                                plot={plot}
                                onChangeChannel={props.onChangeChannel}
                                onAddGate={props.onAddGate}
                                onEditGate={props.onEditGate}
                                addOverlay={props.addOverlay}
                                enrichedFile={enrichedFile}
                                workspaceState={props.workspaceState}
                                allFileMinObj={allFileMinObj}
                                enrichedOverlayFiles={enrichedOverlayFiles}
                                plotIndex={`${fileIndex + 1}-${plotIindex}`}
                                downloadPlotAsImage={props.downloadPlotAsImage}
                              />
                            );
                          }
                        })()}
                    </td>
                  );
                })}
                <td
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    onClick={() => fileViewHideHandler(enrichedFile?.fileId)}
                    style={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      paddingRight: 5,
                    }}
                  >
                    {shouldFileRender.includes(enrichedFile?.fileId)
                      ? "Hide"
                      : "View"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
     */}
    </div>
  );
}

export default Table;
