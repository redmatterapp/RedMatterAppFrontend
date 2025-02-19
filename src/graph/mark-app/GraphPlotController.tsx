import React from "react";
import PlotTableComponent from "./Table";
import { snackbarService } from "uno-material-ui";
import { Tooltip } from "@material-ui/core";
import * as htmlToImage from "html-to-image";
import html2canvas from "html2canvas";
import FCSServices from "./FCSServices/FCSServices";
import numeral from "numeral";
import {
  Grid,
  Button,
  TextField,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
} from "@material-ui/core";
import WorkspaceTopBar from "./WorkspaceTopBar";
// import Modal from "@material-ui/core/Modal";
//@ts-ignore
import Modal from "react-modal";
import MultiStainState from "./MultiStainState.json";
import MultiStainState3 from "./MultiStainState3.json";
import Files from "./Files.json";
import ReactGA from "react-ga";
import {
  superAlgorithm,
  createDefaultPlotSnapShot,
  getPlotChannelAndPosition,
  formatEnrichedFiles,
  DSC_SORT,
  ASC_SORT,
  loopAndCompensate,
  updateEnrichedFilesPlots,
  shouldCalculateMeanMedian,
  kmeans,
  skmeans,
} from "./Helper";
import upArrow from "assets/images/up_arrow.png";
import downArrow from "assets/images/down_arrow.png";
import ChatBox from "./../../Components/common/ChatBox/ChatBox";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { inv } from "mathjs";

//@ts-ignore
import { saveAs } from "file-saver";

interface PlotControllerProps {
  sharedWorkspace: boolean;
  experimentId: string;
  workspaceLoading: boolean;
  plotMoving?: boolean;
  // arrowFunc: Function;
}

interface IState {
  sortByChanged: boolean;
  sortBy: string;
  isTableRenderCall: boolean;
  enrichedFiles: any[];
  workspaceState: any;
  enrichedEvents: any[];
  testParam: string;
  activePipelineId: string;
  parsedFiles: any[];
  uploadingFiles: any[];
  currentParsingFile: string;
  controlFileScale: {};
  appliedMatrixInv: {};
  updatedMatrix: {};
  showSpillover: boolean;
  showRanges: boolean;
  fcsFiles: any[];
  // controlFileId: string;
  userSignUpModalShowing: boolean;
  signUpEmail: string;
  snackbarOpen: boolean;
  uploadedWorkspace: string;
  filesToBeUploaded: string[];
  showFilesToBeUploadedModal: boolean;
  fileNameAndCounts: any;
  selectedDownSample: number;
  customSelectedDownSample: string;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgb(125 204 204)",
    maxWidth: "600px",
    minWidth: "600px",
  },
};

const compCustomStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgb(125 204 204)",
    maxWidth: "800px",
    display: "block",
  },
};

const resetState = () => {
  return {
    sortByChanged: false,
    sortBy: "file",
    isTableRenderCall: false,
    //@ts-ignore
    enrichedFiles: [],
    workspaceState: {},
    //@ts-ignore
    enrichedEvents: [],
    testParam: "some value",
    activePipelineId: "",
    //@ts-ignore
    parsedFiles: [],
    //@ts-ignore
    uploadingFiles: [],
    currentParsingFile: "",
    controlFileScale: {},
    appliedMatrixInv: {},
    updatedMatrix: {},
    showSpillover: false,
    showRanges: false,
    //@ts-ignore
    fcsFiles: [],
    // controlFileId: "",
    userSignUpModalShowing: false,
    signUpEmail: "",
    snackbarOpen: false,
    uploadedWorkspace: "",
    //@ts-ignore
    filesToBeUploaded: [],
    showFilesToBeUploadedModal: false,
    //@ts-ignore
    fileNameAndCounts: [],
    selectedDownSample: 100000,
    customSelectedDownSample: "",
  };
};

class NewPlotController extends React.Component<PlotControllerProps, IState> {
  firebaseApp = {};

  constructor(props: PlotControllerProps) {
    super(props);

    this.state = resetState();

    this.onChangeTableDataType = this.onChangeTableDataType.bind(this);
    this.onChangeColWidth = this.onChangeColWidth.bind(this);
    this.onChangeGateName = this.onChangeGateName.bind(this);
    this.onChangeChannel = this.onChangeChannel.bind(this);
    this.onOpenFileChange = this.onOpenFileChange.bind(this);
    this.onEditGate = this.onEditGate.bind(this);
    this.onEditGateNamePosition = this.onEditGateNamePosition.bind(this);
    this.onAddGate = this.onAddGate.bind(this);
    this.onDeleteGate = this.onDeleteGate.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onNewAnlysis = this.onNewAnlysis.bind(this);
    this.onInitState = this.onInitState.bind(this);
    this.onResetToControl = this.onResetToControl.bind(this);
    this.downloadPlotAsImage = this.downloadPlotAsImage.bind(this);
    this.saveWorkspace = this.saveWorkspace.bind(this);
    this.uploadWorkspace = this.uploadWorkspace.bind(this);
    this.setNewSpillover = this.setNewSpillover.bind(this);
    this.parseUploadedWorkspace = this.parseUploadedWorkspace.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.inputFile = React.createRef();

    if (process.env.REACT_APP_ENV == "production") {
      ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);
    }

    const firebaseConfig = {
      apiKey: "AIzaSyAQvoAX5AHZ-BO20IbqN_E7-zJrXC5XcQo",
      authDomain: "red-matter-1ed2f.firebaseapp.com",
      projectId: "red-matter-1ed2f",
      storageBucket: "red-matter-1ed2f.appspot.com",
      messagingSenderId: "694058183837",
      appId: "1:694058183837:web:f46f7700d16f484c623874",
      measurementId: "G-JSEH91J4NT",
    };

    this.firebaseApp = initializeApp(firebaseConfig);
  }

  inputFile = {
    current: {
      click: function () {},
    },
  };

  onInitState = (workspaceState: any) => {
    // @ts-ignore
    let copyOfLocalFiles: any[] = this.state.fcsFiles;

    //let copyOfLocalFiles: any[] = Files;

    //workspaceState = MultiStainState3;

    const calculateMedianAndMean = shouldCalculateMeanMedian(
      workspaceState.tableDataType
    );

    // @ts-ignore
    if (
      workspaceState &&
      Object.keys(workspaceState).length > 0 &&
      copyOfLocalFiles &&
      copyOfLocalFiles.length > 0
    ) {
      let enrichedFiles: any[] = superAlgorithm(
        copyOfLocalFiles,
        workspaceState,
        calculateMedianAndMean
      );

      enrichedFiles = formatEnrichedFiles(enrichedFiles, workspaceState);

      this.setState({
        ...this.state,
        controlFileScale: enrichedFiles[0].scale,
        appliedMatrixInv: enrichedFiles[0].scale.invertedMatrix
          ? inv(enrichedFiles[0].scale.invertedMatrix.data)
          : {},
        updatedMatrix: enrichedFiles[0].scale.invertedMatrix
          ? enrichedFiles[0].scale.invertedMatrix.data
          : {},
        enrichedFiles: enrichedFiles,
        workspaceState: workspaceState,
      });
    }
  };

  onChangeGateName = (
    changedPlot: any,
    changedGate: any,
    gateNameHasChanged: boolean,
    newGateName: string,
    gateColorHasChanged: boolean,
    newGateColor: string
  ) => {
    this.state.workspaceState.plots.forEach((plot: any) => {
      if (plot.gates) {
        //if (changedPlot.population == plot.population) {
        plot.gates.forEach((gate: any) => {
          // change the gate name
          if (gate.name == changedGate.name) {
            if (gateNameHasChanged) {
              gate.name = newGateName;
            }

            if (gateColorHasChanged) {
              gate.color = newGateColor;
            }
          }

          //change the parent
          if (gate.parent == changedGate.name) {
            if (gateNameHasChanged) {
              gate.parent = newGateName;
            }
          }

          // if (gate.name == changedGate.name) {
          //   if (gateNameHasChanged) {
          //     gate.name = newGateName;
          //   }

          //   if (gateColorHasChanged) {
          //     gate.color = newGateColor;
          //   }
          // }
        });
      }

      if (plot.population == changedGate.name) {
        if (gateNameHasChanged) {
          plot.population = newGateName;
        }

        if (gateColorHasChanged) {
          plot.color = newGateColor;
        }
      }
    });

    //customGates

    if (this.state.workspaceState && this.state.workspaceState.customGates) {
      this.state.workspaceState.customGates.forEach((gate: any) => {
        if (gate.name == changedGate.name) {
          if (gateNameHasChanged) {
            gate.name = newGateName;
          }

          if (gateColorHasChanged) {
            gate.color = newGateColor;
          }
        }
      });
    }

    updateEnrichedFilesPlots(
      this.state.enrichedFiles,
      this.state.workspaceState,
      gateNameHasChanged,
      changedGate.name,
      newGateName,
      gateColorHasChanged,
      changedGate.color,
      newGateColor
    );

    this.setState({
      enrichedFiles: this.state.enrichedFiles,
      workspaceState: this.state.workspaceState,
      isTableRenderCall: !this.state.isTableRenderCall,
    });
  };

  onChangeColWidth = (population: any, width: any) => {
    this.state.workspaceState.plots.forEach((plot: any) => {
      if (plot.population == population) {
        plot.colWidth = width;
      }
    });

    this.setState({
      enrichedFiles: this.state.enrichedFiles,
      workspaceState: this.state.workspaceState,
    });
  };

  onAddGate = (change: any) => {
    // create a new plot from the plot that has just been gated, but remove
    // its gate and set population to be the gate.name
    let newPlot = JSON.parse(JSON.stringify(change.plot));
    newPlot.level++;
    delete newPlot.gates;

    //@ts-ignore
    let newWorkspaceState: any = this.state.workspaceState;

    let level = newPlot.level;

    //@ts-ignore
    let plotsAtSameLevel = newWorkspaceState.plots.filter(
      (plot: any) => plot.level == level
    );

    let numAtThatLevel = plotsAtSameLevel ? plotsAtSameLevel.length : 0;

    newPlot.left =
      (change.plot.plotType == "scatter"
        ? change.plot.width + 150
        : change.plot.width + 250) *
        level +
      20 * numAtThatLevel;
    newPlot.top = change.plot.top + 20 * numAtThatLevel;
    // newPlot.top = 350 * numAtThatLevel;

    newPlot.population = change.newGate.name;
    // for histograms
    newPlot.color = change.newGate.color;
    newPlot.madeOnFile = change.fileId;
    newPlot.height = 200;
    newPlot.width = 200;

    change.newGate.madeOnFile = change.fileId;

    // new plots are only added on the control file,
    // so loop through the other fileIds - which have adjusted gates
    // and make sure to keep them
    // TODO look at below

    let origGatedPlotIndex = newWorkspaceState.plots.findIndex(
      (plot: any) => plot.population == change.plot.population
    );

    let gates = newWorkspaceState.plots[origGatedPlotIndex].gates;

    if (gates && gates.length > 0) {
      newWorkspaceState.plots[origGatedPlotIndex].gates.push(change.newGate);
    } else {
      newWorkspaceState.plots[origGatedPlotIndex].gates = [change.newGate];
    }

    let fileIds = Object.keys(newWorkspaceState.files);
    fileIds.forEach((fileId) => {
      //if (fileId != controlFileId) {

      let plot = newWorkspaceState.files[fileId].plots.find(
        (plot: any) => plot.population == change.plot.population
      );

      if (plot) {
        if (plot.gates && plot.gates.length > 0) {
          plot.gates.push(change.newGate);
        } else {
          plot.gates = [change.newGate];
        }
      }
    });

    newWorkspaceState.plots.push(newPlot);

    let copyOfLocalFiles: any[] = this.state.fcsFiles;
    // let copyOfLocalFiles = JSON.parse(JSON.stringify(Files21));
    const calculateMedianAndMean = shouldCalculateMeanMedian(
      this.state.workspaceState.tableDataType
    );

    let enrichedFiles = superAlgorithm(
      this.state.enrichedFiles,
      newWorkspaceState,
      calculateMedianAndMean
    );
    enrichedFiles = formatEnrichedFiles(enrichedFiles, newWorkspaceState);

    //set state
    this.setState({
      enrichedFiles: enrichedFiles,
      workspaceState: newWorkspaceState,
    });
  };

  onDeleteGate = (gateName: any) => {
    //@ts-ignore
    let newWorkspaceState: any = this.state.workspaceState;

    // find the plot in the array
    // if the plot has gates, find those plots and remove them from plots array
    // remove them from plots array
    // loop through
    let plotsToBeRemoved = [gateName];
    let allPlots = newWorkspaceState.plots;

    allPlots.forEach((plot: any) => {
      if (plotsToBeRemoved.indexOf(plot.population) > -1) {
        if (plot.gates) {
          plot.gates.forEach((gate: any) => {
            plotsToBeRemoved.push(gate.name);
          });
        }
      }
    });

    newWorkspaceState.plots = newWorkspaceState.plots.filter((plot: any) => {
      if (plotsToBeRemoved.indexOf(plot.population) < 0) {
        if (plot.gates) {
          plot.gates = plot.gates.filter((gate: any) => gate.name != gateName);
        }

        return plot;
      }
    });

    if (newWorkspaceState.customGates) {
      newWorkspaceState.customGates = newWorkspaceState.customGates.filter(
        (gate: any) => {
          if (plotsToBeRemoved.indexOf(gate.name) < 0) {
            return gate;
          }
        }
      );
    }

    let copyOfLocalFiles: any[] = this.state.fcsFiles;

    // let copyOfLocalFiles = JSON.parse(JSON.stringify(Files21));
    const calculateMedianAndMean = shouldCalculateMeanMedian(
      this.state.workspaceState.tableDataType
    );
    let enrichedFiles = superAlgorithm(
      copyOfLocalFiles,
      newWorkspaceState,
      calculateMedianAndMean
    );
    enrichedFiles = formatEnrichedFiles(enrichedFiles, newWorkspaceState);

    //set state
    this.setState({
      enrichedFiles: enrichedFiles,
      workspaceState: newWorkspaceState,
    });
  };

  setPlotsOfAllFilesToBeSameAsControl = (plotIndex: any) => {
    let controlEnrichedFile = this.state.enrichedFiles.find(
      (enrichedFile) => enrichedFile.isControlFile
    );
    const filesIds = Object.keys(this.state.workspaceState.files);
    filesIds.forEach((fileId, index) => {
      this.state.workspaceState.files[fileId].plots[plotIndex] = JSON.parse(
        JSON.stringify(controlEnrichedFile.plots[plotIndex])
      );
    });
  };

  onEditGate = (change: any) => {
    let newWorkspaceState: any = this.state.workspaceState;

    let isEditingOriginalFile = change.gate.madeOnFile == change.fileId;
    //newWorkspaceState.controlFileId

    if (isEditingOriginalFile) {
      let gateIndex = newWorkspaceState.plots[change.plotIndex].gates.findIndex(
        (gate: any) => gate.name == change.gate.name
      );

      newWorkspaceState.plots[change.plotIndex].gates[gateIndex] = JSON.parse(
        JSON.stringify(change.gate)
      );
    } else {
      // so editing existing gate on a different file
      if (!newWorkspaceState.customGates) {
        newWorkspaceState.customGates = [];
      }

      let customGate = JSON.parse(JSON.stringify(change.gate));
      customGate.madeOnFile = change.fileId;

      let gateIndex = newWorkspaceState.customGates.findIndex(
        (g: any) => g.name == customGate.name && g.madeOnFile == change.fileId
      );
      if (gateIndex > -1) {
        newWorkspaceState.customGates[gateIndex] = customGate;
      } else {
        newWorkspaceState.customGates.push(customGate);
      }
    }

    newWorkspaceState.plots.forEach((plot: any) => {
      plot.reRender = !plot.reRender;
    });

    if (!isEditingOriginalFile || newWorkspaceState.files[change.fileId]) {
      // so its an editing of a gate only on that file
    }

    let copyOfLocalFiles: any[] = this.state.fcsFiles;
    // let copyOfLocalFiles = JSON.parse(JSON.stringify(Files21));
    const calculateMedianAndMean = shouldCalculateMeanMedian(
      this.state.workspaceState.tableDataType
    );
    let enrichedFiles = superAlgorithm(
      copyOfLocalFiles,
      newWorkspaceState,
      calculateMedianAndMean
    );

    enrichedFiles = formatEnrichedFiles(enrichedFiles, newWorkspaceState);

    this.setState({
      enrichedFiles: enrichedFiles,
      workspaceState: newWorkspaceState,
      isTableRenderCall: !this.state.isTableRenderCall,
    });
  };

  onChangeTableDataType = (change: any) => {
    let enrichedFiles = this.state.enrichedFiles;

    // TODO need to run superAlgorithm()

    if (change.tableDataType == "Mean" || change.tableDataType == "Median") {
      // if its currently neither
      if (
        this.state.workspaceState.tableDataType == "Count" ||
        this.state.workspaceState.tableDataType == "Percentage"
      ) {
        // need to run Super
        enrichedFiles = superAlgorithm(
          this.state.fcsFiles,
          this.state.workspaceState,
          true
        );

        enrichedFiles = formatEnrichedFiles(
          enrichedFiles,
          this.state.workspaceState
        );
      }
    }

    this.state.workspaceState.tableDataType = change.tableDataType;

    this.setState({
      enrichedFiles: enrichedFiles,
      workspaceState: this.state.workspaceState,
      isTableRenderCall: !this.state.isTableRenderCall,
    });
  };

  onEditGateNamePosition = (change: any) => {
    let newWorkspaceState: any = this.state.workspaceState;

    let gateIndex = newWorkspaceState.plots[change.plotIndex].gates.findIndex(
      (gate: any) => gate.name == change.gateName
    );

    newWorkspaceState.plots[change.plotIndex].gates[
      gateIndex
    ].gateNamePosition = change.gateNamePosition;

    this.state.enrichedFiles.forEach((file) => {
      file.plots[change.plotIndex].gates[gateIndex].gateNamePosition =
        change.gateNamePosition;
    });

    if (this.state.workspaceState && this.state.workspaceState.customGates) {
      this.state.workspaceState.customGates.forEach((gate: any) => {
        if (gate.name == change.gateName) {
          gate.gateNamePosition = change.gateNamePosition;
        }
      });
    }

    this.setState({
      enrichedFiles: this.state.enrichedFiles,
      workspaceState: newWorkspaceState,
    });
  };

  downloadPlotAsImage = async (id: string, imageName: string) => {
    if (process.env.REACT_APP_ENV == "production") {
      ReactGA.event({
        category: "Buttons",
        action: "Download As Image clicked",
      });
    }
    const plotElement = document.getElementById(id);
    const canvas = await html2canvas(plotElement);

    var link = document.createElement("a");
    link.download = imageName;
    link.href = canvas.toDataURL("image/png");
    link.click();

    //html2canvas
  };

  saveWorkspace = async (plot: any, plotIndex: any) => {
    if (process.env.REACT_APP_ENV == "production") {
      ReactGA.event({
        category: "Buttons",
        action: "Save Workspace clicked",
      });
    }

    var data = {
      key: "value",
    };
    var fileName = "red_matter_workspace.red";

    // Create a blob of the data
    var fileToSave = new Blob([JSON.stringify(this.state.workspaceState)], {
      type: "application/json",
    });

    // Save the file
    saveAs(fileToSave, fileName);
  };

  uploadWorkspace = async (files: any) => {
    if (process.env.REACT_APP_ENV == "production") {
      ReactGA.event({
        category: "Buttons",
        action: "Add Workspace clicked",
      });
    }

    //@ts-ignore
    let uploadedWorkspace;

    if (files && files.length > 0) {
      uploadedWorkspace = files[0].name;
    } else {
      return;
    }

    let reader = new FileReader();

    // Setup the callback event to run when the file is read
    reader.onload = (event: any) => {
      let str = event.target.result;

      if (str) {
        let workspaceState = JSON.parse(str);

        if (workspaceState) {
          if (!workspaceState.plots) {
            return;
          }

          let plots = workspaceState.plots.map((plot: any) => plot.madeOnFile);

          if (
            workspaceState.customGates &&
            workspaceState.customGates.length > 0
          ) {
            let customPlots = workspaceState.customGates.map(
              (plot: any) => plot.madeOnFile
            );
            plots = plots.concat(customPlots);
          }

          if (!this.state.enrichedEvents) {
            return;
          }

          let fileIds = this.state.enrichedFiles.map(
            (file: any) => file.fileId
          );

          let checker = (fileIds: any, plots: any) =>
            plots.every((v: any) => fileIds.includes(v));

          if (!checker(fileIds, plots)) {
            snackbarService.showSnackbar(
              "The Workspace does not match the files - the files must have the same name as they had when the Workspace was created",
              "error"
            );
            return;
          }

          //@ts-ignore
          this.state.uploadedWorkspace = uploadedWorkspace;

          this.onInitState(workspaceState);
        }
      }
    };

    reader.readAsText(files[0]);

    //this.onInitState(workspaceState);
  };

  parseUploadedWorkspace = (event: any) => {
    let str = event.target.result;

    if (str) {
      let workspaceState = JSON.parse(str);

      if (workspaceState) {
        if (!workspaceState.plots) {
          return;
        }

        let plots = workspaceState.plots.map((plot: any) => plot.madeOnFile);

        if (
          workspaceState.customGates &&
          workspaceState.customGates.length > 0
        ) {
          let customPlots = workspaceState.customGates.map(
            (plot: any) => plot.madeOnFile
          );
          plots = plots.concat(customPlots);
        }

        if (!this.state.enrichedEvents) {
          return;
        }

        let fileIds = this.state.enrichedFiles.map((file: any) => file.fileId);

        let checker = (fileIds: any, plots: any) =>
          plots.every((v: any) => fileIds.includes(v));

        if (!checker(fileIds, plots)) {
          snackbarService.showSnackbar(
            "The Workspace dows not match the files - the files must have the same name as they had when the Workspace was created",
            "error"
          );
          return;
        }

        // workspaceState.uploadedWorkspace =

        this.onInitState(workspaceState);
      }
    }
  };

  onResetToControl = (fileId: string) => {
    let newWorkspaceState: any = JSON.parse(
      JSON.stringify(this.state.workspaceState)
    );
    delete newWorkspaceState.files[fileId];
    let copyOfLocalFiles: any[] = this.state.fcsFiles;
    const calculateMedianAndMean = shouldCalculateMeanMedian(
      this.state.workspaceState.tableDataType
    );
    let enrichedFiles = superAlgorithm(
      copyOfLocalFiles,
      newWorkspaceState,
      calculateMedianAndMean
    );
    enrichedFiles = formatEnrichedFiles(enrichedFiles, newWorkspaceState);

    this.setState({
      enrichedFiles: enrichedFiles,
      workspaceState: newWorkspaceState,
    });
  };

  addOverlay = (
    fileId: string,
    addFileId: string,
    plotIndex: number,
    checked: boolean
  ) => {
    let workspaceState = this.state.workspaceState;
    let newWorkspaceState: any = JSON.parse(JSON.stringify(workspaceState));

    let foundEnrichedFile = this.state.enrichedFiles.find(
      (x: any) => x.fileId == fileId
    );

    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    // if (!newWorkspaceState.files[fileId]) {
    //   newWorkspaceState.files[fileId] = { plots: foundEnrichedFile.plots };
    // }

    let workspaceStatePlot = newWorkspaceState.plots[plotIndex];
    if (!workspaceStatePlot?.overlays) {
      workspaceStatePlot.overlays = [];
    }

    if (color in workspaceStatePlot && color == workspaceStatePlot.color) {
      color = "FFF" + color.substring(0, 3);
    } else if (!(color in workspaceStatePlot) && color == "#000000") {
      color = "FFF" + color.substring(0, 3);
    }

    if (checked)
      workspaceStatePlot.overlays.push({ id: addFileId, color: color });
    else {
      let deleteIndex = workspaceStatePlot.overlays.findIndex(
        (x: any) => x.id == addFileId
      );
      workspaceStatePlot.overlays.splice(deleteIndex, 1);
    }

    let copyOfLocalFiles: any[] = this.state.fcsFiles;
    const calculateMedianAndMean = shouldCalculateMeanMedian(
      this.state.workspaceState.tableDataType
    );
    let enrichedFiles = superAlgorithm(
      copyOfLocalFiles,
      newWorkspaceState,
      calculateMedianAndMean
    );
    enrichedFiles = formatEnrichedFiles(enrichedFiles, newWorkspaceState);

    this.setState({
      enrichedFiles: enrichedFiles,
      workspaceState: newWorkspaceState,
    });
  };

  onChangeChannel = (change: any) => {
    // console.log("in on channel change");
    let type = change.type;
    let fileKey = change.fileId;
    let plotIndex = change.plotIndex;
    //let filesIds;
    let newWorkspaceState: any = this.state.workspaceState;
    // if (!(newWorkspaceState).files[fileKey]) {
    //   // so its a non-control gate being edited, copy plots from control
    //   //@ts-ignore
    //   (newWorkspaceState).files[fileKey] = {
    //     plots: JSON.parse(
    //       JSON.stringify(
    //         (newWorkspaceState).files[newWorkspaceState.controlFileId]
    //           .plots
    //       )
    //     ),
    //   };
    // }

    switch (type) {
      case "ChannelIndexChange":
        // //@ts-ignore
        // workspaceState.files[fileKey].plots[plotIndex].plotType =

        if (change.axis == "x") {
          newWorkspaceState = this.updateWorkspaceStateChannels(
            "x",
            newWorkspaceState,
            change.fileId,
            newWorkspaceState.plots[plotIndex],
            change.axisIndex,
            change.axisLabel,
            change.scaleType,
            change.plotType
          );
        } else {
          newWorkspaceState = this.updateWorkspaceStateChannels(
            "y",
            newWorkspaceState,
            change.fileId,
            newWorkspaceState.plots[plotIndex],
            change.axisIndex,
            change.axisLabel,
            change.scaleType,
            change.plotType
          );
        }

        break;
      case "ChangePlotType":
        newWorkspaceState.plots[plotIndex].plotType = change.plotType;

        break;

      case "ChangePlotScale":
        if (change.axis === "x") {
          newWorkspaceState.plots[plotIndex].xScaleType = change.scale;
        } else {
          newWorkspaceState.plots[plotIndex].yScaleType = change.scale;
        }
        break;
    }

    let enrichedFiles = formatEnrichedFiles(
      this.state.enrichedFiles,
      newWorkspaceState
    );

    this.setState({
      workspaceState: newWorkspaceState,
      enrichedFiles: enrichedFiles,
      isTableRenderCall: !this.state.isTableRenderCall,
    });
  };

  onOpenFileChange = (change: any) => {
    this.state.workspaceState.openFile = change.fileId;
    this.setState({
      workspaceState: this.state.workspaceState,
      enrichedFiles: this.state.enrichedFiles,
    });
  };

  //@ts-ignore
  updateWorkspaceStateChannels = (
    axis: any,
    workspaceState: any,
    fileKeyBeingChanged: any,
    plot: any,
    axisIndex: any,
    axisLabel: any,
    scaleType: any,
    plotType: any
  ) => {
    if (axis == "x") {
      plot.xAxisIndex = axisIndex;
      plot.xAxisLabel = axisLabel;
      plot.xScaleType = scaleType;
      plot.plotType = plotType;
    } else {
      plot.yAxisIndex = axisIndex;
      plot.yAxisLabel = axisLabel;
      plot.yScaleType = scaleType;
      plot.plotType = plotType;
    }

    return JSON.parse(JSON.stringify(workspaceState));
  };

  sortByGate = (gateName: any, sortType: any) => {
    let enrichedFiles = this.state.enrichedFiles;
    let controlEnrichedFile = enrichedFiles.find(
      (enrichedFile) => enrichedFile.isControlFile
    );

    enrichedFiles.sort((enrichedFile1: any, enrichedFile2: any) => {
      const gateStat1 = enrichedFile1.gateStats.find(
        (gateStat: any) => gateStat.gateName == gateName
      );

      const gateStat2 = enrichedFile2.gateStats.find(
        (gateStat: any) => gateStat.gateName == gateName
      );

      // TODO sometimes gateStat1 or gateStat2 are null - why?
      if (!gateStat1) {
        return 1;
      }

      if (!gateStat2) {
        return 0;
      }

      if (sortType === ASC_SORT) {
        if (
          parseFloat(gateStat1.percentage) > parseFloat(gateStat2.percentage)
        ) {
          return 1;
        } else if (
          parseFloat(gateStat1.percentage) < parseFloat(gateStat2.percentage)
        ) {
          return -1;
        } else {
          return 0;
        }
      } else {
        // do desc
        if (
          parseFloat(gateStat1.percentage) < parseFloat(gateStat2.percentage)
        ) {
          return 1;
        } else if (
          parseFloat(gateStat1.percentage) > parseFloat(gateStat2.percentage)
        ) {
          return -1;
        } else {
          return 0;
        }
      }
    });

    let originalFiles: any[] = this.state.fcsFiles;
    let sortedFiles = [];

    for (
      let sortedFileIndex = 0;
      sortedFileIndex < enrichedFiles.length;
      sortedFileIndex++
    ) {
      for (
        let originalFileIndex = 0;
        originalFileIndex < originalFiles.length;
        originalFileIndex++
      ) {
        if (
          originalFiles[originalFileIndex].id ===
          enrichedFiles[sortedFileIndex].fileId
        ) {
          sortedFiles.push(originalFiles[originalFileIndex]);
          break;
        }
      }
    }

    this.setState({
      enrichedFiles: enrichedFiles,
    });
  };

  onNewAnlysis = () => {
    if (process.env.REACT_APP_ENV == "production") {
      ReactGA.event({
        category: "Buttons",
        action: "New Analysis clicked",
      });
    }

    const resettedState = resetState();
    this.setState(resettedState);
  };

  onResize = (change: any) => {
    let newWorkspaceState: any = this.state.workspaceState;

    let plot = newWorkspaceState.plots[change.plotIndex];

    plot.width = Math.round(change.width);
    plot.height = Math.round(change.height);
    plot.reRender = plot.reRender ? !plot.reRender : true;

    this.state.enrichedFiles.forEach((file) => {
      file.plots[change.plotIndex].width = Math.round(change.width);
      file.plots[change.plotIndex].height = Math.round(change.height);
      file.plots[change.plotIndex].reRender = file.plots[change.plotIndex]
        .reRender
        ? !file.plots[change.plotIndex].reRender
        : true;
    });

    // let copyOfLocalFiles: any[] = this.state.fcsFiles;
    // let enrichedFiles = superAlgorithm(copyOfLocalFiles, newWorkspaceState);
    // enrichedFiles = formatEnrichedFiles(enrichedFiles, newWorkspaceState);

    newWorkspaceState.plots.forEach((plot: any) => {
      plot.reRender = !plot.reRender;
    });

    this.setState({
      enrichedFiles: this.state.enrichedFiles,
      workspaceState: newWorkspaceState,
      isTableRenderCall: !this.state.isTableRenderCall,
    });
  };

  showUploadModal = async (files: []) => {
    const fcsservice = new FCSServices();

    // loop through files
    let fileNameAndCounts = [];
    for (let i = 0; i < files.length; i++) {
      //@ts-ignore
      let fcsFile = await files[i].arrayBuffer().then(async (e) => {
        const buf = Buffer.from(e);
        return await fcsservice.loadFileMetadata(buf, 1).then((e) => {
          return e;
        });
      });

      //@ts-ignore
      files[i].eventCount = fcsFile.meta.eventCount;
      //@ts-ignore
      files[i].text = fcsFile.text;

      fileNameAndCounts.push({
        //@ts-ignore
        fileName: files[i].name,
        //@ts-ignore
        eventCount: files[i].eventCount,
      });
    }

    this.setState({
      ...this.state,
      showFilesToBeUploadedModal: true,
      //@ts-ignore
      filesToBeUploaded: files,
      fileNameAndCounts: fileNameAndCounts,
    });
  };

  uploadFiles = async (files: FileList, eventCount: number) => {
    const fileList: { tempId: string; file: File }[] = [];
    const allowedExtensions = ["fcs", "lmd"];

    let listSize = 0;
    for (const file of Array.from(files)) {
      listSize += file.size;
      if (
        !allowedExtensions.includes(file.name.split(".").pop().toLowerCase())
      ) {
        snackbarService.showSnackbar(
          file.name.substring(0, 20) +
            (file.name.length > 20 ? "..." : "") +
            '"' +
            'Is not a .fcs or .lmd file: "',
          "error"
        );
        continue;
      }
      const id = Math.random().toString(36).substring(7);
      fileList.push({ tempId: id, file });
    }

    const fcsservice = new FCSServices();
    let fcsFiles = this.state.fcsFiles || [];
    let abandon = false;
    for (const file of fileList) {
      this.setState({
        ...this.state,
        currentParsingFile: file.file.name,
      });

      //setcurrentParsingFile(file.file.name);

      //fileTempIdMap[file.tempId] = "";
      let fcsFile = await file.file.arrayBuffer().then(async (e) => {
        const buf = Buffer.from(e);
        return await fcsservice.loadFileMetadata(buf, eventCount).then((e) => {
          return e;
        });
      });

      // fcsFile.events = skmeans(fcsFile.events);

      if (this.state.fcsFiles && this.state.fcsFiles.length > 0) {
        if (this.state.fcsFiles[0].channels.length != fcsFile.channels.length) {
          fcsFiles = [];
          const resettedState = resetState();
          this.setState(resettedState);
          alert(
            "Could not parse files - channels are not the same. Only upload files with the same channels"
          );
          abandon = true;
          // let s = this.state;
          // debugger;
          break;
        }
      }

      //@ts-ignore
      fcsFile.name = file.file.name;
      //@ts-ignore
      fcsFile.fileId = file.file.name;
      //@ts-ignore
      fcsFile.id = file.file.name;
      //@ts-ignore
      fcsFile.label = file.file.label;

      if (process.env.REACT_APP_ENV == "production") {
        ReactGA.event({
          category: "File",
          action:
            "File with  " +
            //@ts-ignore
            fcsFile.events?.length +
            " events and " +
            fcsFile.channels.length +
            " channels uploaded",
        });
      }

      let currentParsedFiles = this.state.parsedFiles || [];
      currentParsedFiles.push({
        name: file.file.name,
        //@ts-ignore
        eventCount: fcsFile.events ? fcsFile.events.length : 0,
      });

      this.setState({
        ...this.state,
        parsedFiles: JSON.parse(JSON.stringify(currentParsedFiles)),
      });

      this.setState({
        ...this.state,
        currentParsingFile: "",
      });

      fcsFiles.push(fcsFile);
    }

    if (!abandon) {
      let workspaceState = this.state.workspaceState;

      if (
        (!workspaceState || Object.keys(workspaceState).length == 0) &&
        fcsFiles &&
        fcsFiles.length > 0
      ) {
        let controlFile = fcsFiles[0];
        const {
          xAxisLabel,
          yAxisLabel,
          xAxisIndex,
          yAxisIndex,
          xAxisScaleType,
          yAxisScaleType,
        } = getPlotChannelAndPosition(controlFile);

        workspaceState = createDefaultPlotSnapShot(
          controlFile.id,
          xAxisLabel,
          yAxisLabel,
          xAxisIndex,
          yAxisIndex,
          xAxisScaleType,
          yAxisScaleType
        );
      }

      this.setState({
        ...this.state,
        //controlFileId: this.state.controlFileId || fcsFiles[0].id,
        fcsFiles: fcsFiles,
        parsedFiles: [],
        //workspaceState: workspaceState,
      });

      if (localStorage.getItem("signup") != "true") {
        this.setState({
          ...this.state,
          userSignUpModalShowing: true,
        });
      }

      this.onInitState(workspaceState);
    }
  };

  componentDidUpdate(
    prevProps: Readonly<PlotControllerProps>,
    prevState: Readonly<IState>,
    snapshot?: any
  ): void {}

  componentDidMount() {}

  updateSpillover = (rowI: any, colI: any, newColumnData: any) => {
    // this.state.fcsFiles[0].scale.setSpilloverInvertedMatrix(
    //       //@ts-ignore
    //       this.state.controlFileScale.invertedMatrix
    //     );

    //@ts-ignore
    this.state.updatedMatrix[rowI][colI] =
      parseFloat(newColumnData) || newColumnData;

    this.setState({
      ...this.state,
      controlFileScale: this.state.controlFileScale,
    });
  };

  setNewSpillover = () => {
    let workspace = this.state.workspaceState;

    this.state.fcsFiles.find((fcsFile) => {
      if (fcsFile.id == workspace.controlFileId) {
        fcsFile.scale.setSpilloverInvertedMatrix(
          //@ts-ignore
          this.state.controlFileScale.invertedMatrix
        );
      }
    });
    //loopAndCompensate

    this.state.fcsFiles.forEach((fcsFile) => {
      //(events, scale, channels, origEvents)

      loopAndCompensate(
        fcsFile.events,
        fcsFile.paramNamesHasSpillover,
        fcsFile.scale,
        this.state.appliedMatrixInv,
        this.state.updatedMatrix
      );

      // fcsFile.events = compensatedEvents;
    });

    //loopAndCompensate();

    //@ts-ignore
    let appliedMatrixInv = inv(this.state.updatedMatrix);
    //@ts-ignore
    this.state.appliedMatrixInv = JSON.parse(JSON.stringify(appliedMatrixInv));
    //@ts-ignore
    this.state.showSpillover = false;

    this.onInitState(this.state.workspaceState);
  };

  updateRanges = (rowI: any, minOrMax: any, newRange: any) => {
    this.state.fcsFiles.forEach((fcsFile) => {
      fcsFile.channels[rowI][minOrMax] = Number(newRange);
    });

    let controlEnrichedFile = this.state.enrichedFiles[0];

    //this.state.fcsFiles.forEach((fcsFile) => {
    controlEnrichedFile.channels[rowI][minOrMax] = newRange;
    //});

    this.setState({
      ...this.state,
      fcsFiles: this.state.fcsFiles,
    });
  };

  onRangeChange = (channels: any) => {
    // let controlEnrichedFile = this.state.enrichedFiles.find(
    //   (enrichedFile) => enrichedFile.isControlFile
    // );

    let files = this.state.fcsFiles;
    let workspace = this.state.workspaceState;
    files.find((file) => {
      file.channels.forEach((channel: any, index: any) => {
        channel.minimum = parseFloat(channels[index].minimum);
        channel.maximum = parseFloat(channels[index].maximum);
      });
    });

    this.setState({
      ...this.state,
      showRanges: false,
    });

    this.onInitState(this.state.workspaceState);
  };

  compCustomStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "rgb(125 204 204)",
      maxWidth: "800px",
    },
  };

  renderTable = () => {
    if (this.state.enrichedFiles?.length > 0) {
      return (
        <>
          <WorkspaceTopBar
            fcsFiles={this.state.fcsFiles}
            workspaceState={this.state.workspaceState}
            downloadPlotAsImage={this.downloadPlotAsImage}
            saveWorkspace={this.saveWorkspace}
            uploadWorkspace={this.uploadWorkspace}
            uploadedWorkspace={this.state.uploadedWorkspace}
            onNewAnlysis={this.onNewAnlysis}
          />
          <div
            style={{
              borderTop: "1px solid #ccc",
              paddingTop: "5px",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>
              <Button
                variant="outlined"
                style={{
                  backgroundColor: "#fafafa",
                  color: "#1890ff",
                  marginLeft: 5,
                  marginBottom: 3,
                  // color: "white",
                }}
                onClick={(e) => {
                  if (process.env.REACT_APP_ENV == "production") {
                    ReactGA.event({
                      category: "Buttons",
                      action: "Reset Analysis clicked",
                    });
                  }

                  let firstFile = this.state.fcsFiles[0];
                  const {
                    xAxisLabel,
                    yAxisLabel,
                    xAxisIndex,
                    yAxisIndex,
                    xAxisScaleType,
                    yAxisScaleType,
                  } = getPlotChannelAndPosition(firstFile);

                  let workspaceState = createDefaultPlotSnapShot(
                    firstFile.id,
                    xAxisLabel,
                    yAxisLabel,
                    xAxisIndex,
                    yAxisIndex,
                    xAxisScaleType,
                    yAxisScaleType
                  );

                  //@ts-ignore
                  this.state.uploadedWorkspace = "";
                  this.onInitState(workspaceState);
                }}
              >
                Reset This Analysis
              </Button>
            </div>
            <div
              style={{
                marginLeft: "auto",
              }}
            >
              {/* @ts-ignore */}
              {this.state.controlFileScale?.spilloverParams && (
                <Tooltip
                  title={
                    "Details of compensation that has been automatically applied to the samples"
                  }
                >
                  <Button
                    variant="outlined"
                    style={{
                      // backgroundColor: "#6666AA",
                      marginLeft: 5,
                      marginBottom: 3,
                      // color: "white",
                    }}
                    onClick={(e) => {
                      if (process.env.REACT_APP_ENV == "production") {
                        ReactGA.event({
                          category: "Buttons",
                          action: "Compensation clicked",
                        });
                      }
                      this.setState({
                        ...this.state,
                        showSpillover: !this.state.showSpillover,
                      });
                    }}
                  >
                    Update Compensation
                    <img
                      src={!this.state?.showSpillover ? downArrow : upArrow}
                      alt="arrow-icon"
                      style={{ width: 10, height: 10, marginLeft: 10 }}
                    />
                  </Button>
                </Tooltip>
              )}
            </div>
            {this.state.showSpillover && (
              <Modal
                isOpen={this.state.showSpillover}
                appElement={document.getElementById("root") || undefined}
                // style={this.compCustomStyles}
                style={compCustomStyles}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "cneter",
                    justifyContent: "center",
                  }}
                >
                  <TableContainer component={Paper}>
                    <Table
                      style={{
                        color: "#000",
                        //backgroundColor: "#ffff99",
                        textAlign: "center",
                        fontWeight: "bold",
                        marginBottom: 20,
                        border: "1px solid #e0e0eb",
                        height: "500px",
                        overflow: "scroll",
                        display: "block",
                      }}
                    >
                      <TableBody>
                        <TableRow>
                          <TableCell>Fluorochrome</TableCell>
                          {/* @ts-ignore */}
                          {this.state.controlFileScale?.spilloverParams.map(
                            (label: any, i: any) => {
                              return (
                                <TableCell key={`th--${i}`}>{label}</TableCell>
                              );
                            }
                          )}
                        </TableRow>
                        {/* @ts-ignore */}
                        {this.state.updatedMatrix?.map(
                          (rowData: any, rowI: number) => {
                            return (
                              <TableRow key={`tr--${rowI}`}>
                                <TableCell
                                  key={`td--${rowI}`}
                                  style={{
                                    border: "1px solid #e0e0eb",
                                    padding: 3,
                                  }}
                                >
                                  {
                                    /* @ts-ignore */
                                    /* @ts-ignore */
                                    this.state.controlFileScale?.spilloverParams[rowI]
                                  }
                                </TableCell>

                                {rowData.map(
                                  (columnData: any, colI: number) => {
                                    return (
                                      <TableCell
                                        key={`th-${rowI}-${colI}`}
                                        style={{
                                          border: "1px solid #e0e0eb",
                                          padding: 3,
                                        }}
                                      >
                                        <TextField
                                          style={
                                            {
                                              //width: "20%",
                                            }
                                          }
                                          value={columnData}
                                          onChange={(newColumnData: any) => {
                                            this.updateSpillover(
                                              rowI,
                                              colI,
                                              newColumnData.target.value
                                            );
                                          }}
                                        />
                                      </TableCell>
                                    );
                                  }
                                )}
                              </TableRow>
                            );
                          }
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Button
                    variant="outlined"
                    style={{
                      // backgroundColor: "#6666AA",
                      marginLeft: 5,
                      marginBottom: 3,
                      backgroundColor: "#6666AA",
                      color: "white",
                    }}
                    onClick={(e) => {
                      this.setNewSpillover();
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    style={{
                      // backgroundColor: "#6666AA",
                      marginLeft: 5,
                      marginBottom: 3,
                      backgroundColor: "#6666AA",
                      color: "white",
                    }}
                    onClick={(e) => {
                      this.setState({
                        ...this.state,
                        showSpillover: false,
                      });
                    }}
                  >
                    Close
                  </Button>
                </div>
              </Modal>
            )}
          </div>
          <div id="entire-table">
            <PlotTableComponent
              isTableRenderCall={this.state.isTableRenderCall}
              enrichedFiles={this.state.enrichedFiles}
              workspaceState={this.state.workspaceState}
              className="workspace"
              onChangeChannel={this.onChangeChannel}
              onOpenFileChange={this.onOpenFileChange}
              addOverlay={this.addOverlay}
              onChangeGateName={this.onChangeGateName}
              onAddGate={this.onAddGate}
              onDeleteGate={this.onDeleteGate}
              onEditGate={this.onEditGate}
              onEditGateNamePosition={this.onEditGateNamePosition}
              onResize={this.onResize}
              sortByGate={this.sortByGate}
              downloadPlotAsImage={this.downloadPlotAsImage}
              onResetToControl={this.onResetToControl}
              testParam={this.state.testParam}
              onRangeChange={this.onRangeChange}
              onChangeColWidth={this.onChangeColWidth}
              onChangeTableDataType={this.onChangeTableDataType}
            />
          </div>

          {/* {1==1 && (
            return this.renderUploadPanel();
          )
          } */}
          {this.renderUploadPanel()}
        </>
      );
    } else return null;
  };

  handleUserSignUp = () => {
    // @ts-ignore
    const db = getFirestore(this.firebaseApp);
    localStorage.setItem("signup", "true");

    try {
      const docRef = addDoc(collection(db, "users"), {
        email: this.state.signUpEmail,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    this.setState({
      ...this.state,
      userSignUpModalShowing: false,
    });
  };

  // async loopNumbers(firebaseApp: any) {
  //   const db = getFirestore(firebaseApp);

  //   try {
  //     const docRef = await addDoc(collection(db, "users"), {
  //     });
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }
  // }

  renderUploadPanel = () => {
    return (
      <div
        style={{
          textAlign: "center",
        }}
      >
        {this.state.currentParsingFile?.length > 0 ? (
          <>
            <Grid
              item
              xs={12}
              style={{
                textAlign: "left",
                marginTop: 15,
                marginLeft: 10,
              }}
            >
              <h3>
                <b
                  style={{
                    backgroundColor: "#ff8080",
                    border: "solid 1px #ddd",
                    borderRadius: 5,
                    padding: 5,
                    marginRight: 10,
                  }}
                >
                  Parsing file, please wait....
                </b>
                {this.state.currentParsingFile}
                <div className="fancy-spinner">
                  <div className="ring"></div>
                  <div className="ring"></div>
                  <div className="dot"></div>
                </div>
              </h3>
            </Grid>
          </>
        ) : null}
        {this.state.parsedFiles &&
          this.state.parsedFiles?.map((e: any, i: number) => {
            return (
              <div key={`uploadingFiles-${i}`}>
                <Grid
                  item
                  xs={12}
                  style={{
                    textAlign: "left",
                    marginTop: 15,
                    marginLeft: 10,
                  }}
                >
                  <h3>
                    <b
                      style={{
                        backgroundColor: "#dfd",
                        border: "solid 1px #ddd",
                        borderRadius: 5,
                        padding: 5,
                        marginRight: 10,
                      }}
                    >
                      file
                    </b>
                    {e.name}
                    {"   "}•{"   "}{" "}
                    <b
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: "#777",
                      }}
                    >
                      {e.eventCount + " events"}
                    </b>
                  </h3>
                </Grid>
              </div>
            );
          })}

        <div>
          <span>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#6666AA",
                maxHeight: 50,
                marginTop: 20,
                marginBottom: 25,
                color: "white",
              }}
              onClick={() => {
                this.inputFile.current.click();
              }}
            >
              <input
                type="file"
                id="file"
                //@ts-ignore
                ref={this.inputFile}
                multiple
                accept=".fcs, .lmd"
                style={{ display: "none" }}
                onClick={(e) => {
                  /* @ts-ignore */
                  e.target.value = "";
                }}
                onChange={(e) => {
                  /* @ts-ignore */
                  this.showUploadModal(e.target.files);
                }}
              />
              Add FCS Files
            </Button>

            <Modal
              isOpen={this.state.showFilesToBeUploadedModal}
              appElement={document.getElementById("root") || undefined}
              style={customStyles}
            >
              {/* list the filesToBeUploaded */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3
                  style={{
                    textAlign: "center",
                  }}
                >
                  Files to be analysed
                </h3>
                <p
                  style={{
                    border: "1px solid #dadee6",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      maxHeight: "400px",
                      overflow: "scroll",
                    }}
                  >
                    {this.state.fileNameAndCounts.map(
                      (file: any, index: number) => (
                        <div
                          key={"file-tbu-" + index}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <div
                            key={"file-tbu-child-" + index}
                            style={{
                              width: "70%",
                              padding: "1px",
                              wordWrap: "break-word",
                              fontSize: 10,
                            }}
                          >
                            {file.fileName}
                          </div>
                          <div
                            key={"file-tbu-events-" + index}
                            style={{
                              width: "30%",
                              padding: "1px",
                              fontSize: 10,
                            }}
                          >
                            {numeral(file.eventCount).format("0,0")} events
                          </div>
                        </div>
                      )
                    )}
                    <p
                      style={{
                        border: "1px solid #dadee6",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* // fileNameAndCounts is an array with objects with property eventCount. check entries eventC */}

                    {this.state.fileNameAndCounts.filter(
                      (fileNameAndCount: any) =>
                        fileNameAndCount.eventCount > 100000
                    ).length > 0 ? (
                      <>
                        <p>
                          Some files have more than 100,000 events. Downsampling
                          will pick events at even intervals:
                        </p>
                        <div>
                          <input
                            type="radio"
                            id="100000"
                            name="selectedDownSample"
                            value="100000"
                            checked={this.state.selectedDownSample === 100000}
                            onChange={(e) => {
                              this.setState({
                                selectedDownSample: Number(e.target.value),
                              });
                            }}
                          />
                          <label
                            style={{
                              marginLeft: 10,
                            }}
                            htmlFor="100000"
                          >
                            100,000
                          </label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="50000"
                            name="selectedDownSample"
                            value="50000"
                            checked={this.state.selectedDownSample === 50000}
                            onChange={(e) => {
                              this.setState({
                                selectedDownSample: Number(e.target.value),
                              });
                            }}
                          />
                          <label
                            style={{
                              marginLeft: 10,
                            }}
                            htmlFor="50000"
                          >
                            50,000
                          </label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="10000"
                            name="selectedDownSample"
                            value="10000"
                            checked={this.state.selectedDownSample === 10000}
                            onChange={(e) => {
                              this.setState({
                                selectedDownSample: Number(e.target.value),
                              });
                            }}
                          />
                          <label
                            style={{
                              marginLeft: 10,
                            }}
                            htmlFor="10000"
                          >
                            10,000
                          </label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="custom"
                            name="selectedDownSample"
                            value="0"
                            checked={this.state.selectedDownSample === 0}
                            onChange={(e) => {
                              this.setState({
                                selectedDownSample: Number(e.target.value),
                              });
                            }}
                          />
                          <label
                            style={{
                              marginLeft: 10,
                            }}
                            htmlFor="custom"
                          >
                            Custom
                          </label>
                        </div>
                        {this.state.selectedDownSample === 0 ? (
                          <div>
                            <input
                              type="number"
                              value={this.state.customSelectedDownSample}
                              onChange={(e) => {
                                this.setState({
                                  customSelectedDownSample: e.target.value,
                                });
                              }}
                            />
                          </div>
                        ) : (
                          <></>
                        )}

                        <div>
                          <input
                            type="radio"
                            id="noDownSample"
                            name="selectedDownSample"
                            value="-1"
                            checked={this.state.selectedDownSample === -1}
                            onChange={(e) => {
                              this.setState({
                                selectedDownSample: -1,
                              });
                            }}
                          />
                          <label
                            style={{
                              marginLeft: 10,
                            }}
                            htmlFor="noDownSample"
                          >
                            No Downsample
                          </label>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  {/* // check the maximum eventCount is greater than 100000*/}

                  {/*
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        border: "1px red dotted",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          border: "1px red dotted",
                        }}
                      >
                        <div
                          style={{
                            width: "70%",
                            
                            padding: "10px",
                            wordWrap: "break-word",
                          }}
                        >
                          Total */}
                </div>

                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#fff",
                    maxHeight: 50,
                    marginTop: 20,
                    color: "black",
                  }}
                  onClick={() => {
                    // @ts-ignore
                    this.uploadFiles(
                      // @ts-ignore
                      this.state.filesToBeUploaded,
                      this.state.selectedDownSample != 0
                        ? this.state.selectedDownSample
                        : Number(this.state.customSelectedDownSample) || -1
                    );

                    this.setState({
                      ...this.state,
                      showFilesToBeUploadedModal: false,
                      filesToBeUploaded: [],
                      selectedDownSample: 100000,
                      customSelectedDownSample: "",
                    });
                    //this.showUploadModal(this.state.filesToBeUploaded);
                  }}
                >
                  Confirm
                </Button>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#fff",
                    maxHeight: 50,
                    marginTop: 20,
                    marginBottom: 25,
                    color: "black",
                  }}
                  onClick={() => {
                    this.setState({
                      ...this.state,
                      showFilesToBeUploadedModal: false,
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Modal>

            <Modal
              isOpen={this.state.userSignUpModalShowing}
              appElement={document.getElementById("root") || undefined}
              style={customStyles}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <label>
                  Sign up for latest updates about Red Matter App - the free &
                  instant flow cytometry analysis tool{" "}
                </label>
                <TextField
                  style={{
                    width: 200,
                    marginLeft: 5,
                    backgroundColor: "#fff",
                    // border: "none",
                    // borderRadius: 5,
                    // outline: "none",
                  }}
                  onChange={(e) => {
                    this.setState({
                      ...this.state,
                      signUpEmail: e.target.value,
                    });
                  }}
                />

                {/* <p style={{ height: 16, textAlign: "center", paddingTop: 2.5 }}>
                  {gateName.error && "A unique gate name is required"}
                </p> */}
                <div
                  style={{
                    padding: 10,
                    alignSelf: "center",
                    paddingTop: 0,
                    paddingBottom: 25,
                  }}
                ></div>
                <div style={{ margin: "auto" }}>
                  <Button
                    style={{
                      backgroundColor: "#6666AA",
                      color: "#fff",
                      marginRight: 5,
                      // backgroundColor:
                      //   gateName.error || !gateName.name ? "#f3f3f3" : "white",
                      // borderRadius: 5,
                      // border: "none",
                      // cursor:
                      //   gateName.error || !gateName.name ? "auto" : "pointer",
                      // color:
                      //   gateName.error || !gateName.name ? "gray" : "black",
                    }}
                    // disabled={gateName.error || !gateName.name}
                    onClick={(e) => {
                      this.handleUserSignUp();
                    }}
                  >
                    Sign Up
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "#6666AA",
                      color: "#fff",
                      // backgroundColor: "white",
                      // borderRadius: 5,
                      // border: "none",
                      // cursor: "pointer",
                    }}
                    onClick={() => {
                      localStorage.setItem("signup", "true");
                      this.setState({
                        ...this.state,
                        userSignUpModalShowing: false,
                      });
                    }}
                  >
                    Dont Sign Up
                  </Button>
                  {/* <button
                    style={{
                      backgroundColor: "white",
                      borderRadius: 5,
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => onCancelGateName()}
                  >
                    Cancel
                  </button> */}
                </div>
              </div>
            </Modal>
          </span>
          <p
            style={{
              color: "#ff4d4d",
              fontWeight: "bold",
              marginBottom: 25,
            }}
          >
            No data leaves the browser
          </p>
        </div>
        <ChatBox />
      </div>
    );
  };

  render() {
    if (this.state.workspaceState.plots) {
      // const plotGroups = getPlotGroups(getWorkspace().plots);
      return this.renderTable();
    } else {
      return this.renderUploadPanel();
    }
  }
}

export default NewPlotController;
