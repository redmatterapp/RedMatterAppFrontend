/*
  dataManager - Singleton class reponsible for controlling the flow of all data
  on graphs, providing this data to each file and reloading visualization

  This is the main source of truth, all other classes extract from here the
  exitance or non-existance of any attribute. Any conflicting view with this
  class about the state of the workspace should never be tolerated. Because of 
  this, it's easy load new files from any source, as long as they follow the 
  FCSFile interface, delete, update or save them also.
*/
import FCSFile from "./fcsFile";
import Gate from "./gate/gate";
import Plot from "../plotManagement/plot";

const uuid = require("uuid");

/* TypeScript does not deal well with decorators. Your linter might
   indicate a problem with this function but it does not exist 
   
   This is resposible for publishing any data manager call, basically
   a custom listener for state changes, a lot simpler to use than redux*/
const publishDecorator = () => {
  return function (
    target: DataManager,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const ret = original.apply(this, args);
      //@ts-ignore
      this.publish(key);
      return ret;
    };
  };
};

class DataManager {
  private static instance: DataManager;

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }

    return DataManager.instance;
  }

  observers: Map<string, { id: string; func: Function }[]> = new Map();

  files: Map<string, FCSFile> = new Map();
  plots: Map<string, Plot> = new Map();
  gates: Map<string, Gate> = new Map();

  // Function resposible for re-rendering the whole plot if need be.
  // As this class is the source of truth, when it's updated it expects
  // to have this function set so it can reflect that update.
  rerender: Function = () => {};
  loading = false;

  /* === GENERAL === */
  getInstanceIDOfNewObject(): string {
    const newObjectInstaceID = uuid.v4();
    return newObjectInstaceID;
  }

  setRerendererCallback(rerenderer: Function) {
    this.rerender = rerenderer;
  }

  /* === FCSFILE LOGIC === */
  addFile(file: FCSFile): string {
    const fileId = this.getInstanceIDOfNewObject();
    this.files.set(fileId, file);
    this.rerender();
    return fileId;
  }

  removeFile(fileId: string) {
    if (this.files.has(fileId)) {
      this.files.delete(fileId);
      this.rerender();
      return;
    }
    throw Error("File " + fileId + " was not found");
  }

  getFiles() {
    const files: { file: FCSFile; id: string }[] = [];
    this.files.forEach((v, k) => {
      files.push({ file: v, id: k });
    });
    return files;
  }

  getFile(fileID: string) {
    return this.files.get(fileID);
  }

  createSubpopFile(plotID: string, inverse: boolean = false) {
    const cplot = this.plots.get(plotID);
    cplot.createSubpop(inverse);
  }

  /* === PLOT LOGIC === */
  addPlot(fileID: string) {}

  getAllPlots(): Map<string, Plot> {
    const files = this.getFiles();
    const present: string[] = [];

    for (const file of files) {
      present.push(file.id);
      if (!this.plotIsPresent(file.id)) {
        this.plots.set(file.id, new Plot(file.file, file.id));
      }
    }

    this.plots.forEach((_, k) => {
      if (!present.includes(k)) {
        this.plots.delete(k);
      }
    });

    return this.plots;
  }

  /* === GATE LOGIC === */
  getAllGates(): Map<string, Gate> {
    return this.gates;
  }

  @publishDecorator()
  addGateToPlot(gateID: string, plotID: string, createSubpop: boolean = false) {
    if (!this.plotIsPresent(plotID)) {
      throw Error("Adding gate to non-existent plot");
    }
    if (!this.gateIsPresent(gateID)) {
      throw Error("Adding non-existent gate to plot");
    }
    const cplot = this.plots.get(plotID);
    cplot.addGate(this.gates.get(gateID), createSubpop);
  }

  @publishDecorator()
  removeGateFromPlot(gateID: string, plotID: string) {
    if (!this.plotIsPresent(plotID)) {
      throw Error("Removing gate to non-existent plot");
    }
    if (!this.gateIsPresent(gateID)) {
      throw Error("Removing non-existent gate to plot");
    }
    const plotGates = this.plots.get(plotID).gates;
    let found = -1;
    for (let indx in plotGates) {
      if (plotGates[indx].id == gateID) {
        this.plots.get(plotID).removeGate(plotGates[indx].id);
        return;
      }
    }
    throw Error("Gate " + gateID + " was not found in plot " + plotID);
  }

  @publishDecorator()
  addGate(gate: Gate): string {
    const gateID = this.getInstanceIDOfNewObject();
    gate.setID(gateID);
    this.gates.set(gateID, gate);
    return gateID;
  }

  /* === OBSERVER LOGIC === */
  addObserver(type: string, callback: Function): string {
    const observerID = this.getInstanceIDOfNewObject();
    const observer = { id: observerID, func: callback };
    if (this.observers.has(type)) {
      this.observers.set(type, [...this.observers.get(type), observer]);
    } else {
      this.observers.set(type, [observer]);
    }
    return observerID;
  }

  removeObserver(type: string, id: string) {
    if (this.observers.has(type)) {
      const list = this.observers.get(type);
      const beforeSize = list.length;
      list.filter((observer) => observer.id != id);
      if (beforeSize === list.length) {
        throw Error("Observer not found");
      }
      this.observers.set(type, list);
    } else {
      throw Error("Removing observer from non-existent observing type");
    }
  }

  private publish(type: string) {
    if (!this.observers.has(type)) return;
    this.observers.get(type).forEach((e) => e.func());
  }

  private plotIsPresent(id: string): boolean {
    return this.plots.has(id);
  }

  private gateIsPresent(id: string): boolean {
    return this.gates.has(id);
  }
}

export default DataManager.getInstance();
