import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useSelector } from "react-redux";
import { Gate, Plot } from "graph/resources/types";
import WorkspaceDispatch from "graph/workspaceRedux/workspaceDispatchers";
import { getGate, getPopulation, getWorkspace } from "graph/utils/workspace";
import { createSubpopPlot } from "graph/resources/plots";
let gates: Gate[] = [];
export default function GateNamePrompt() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [nameError, setNameError] = React.useState(false);
  const [name, setName] = React.useState("");

  useSelector((e: any) => {
    const newGates = e.workspace.gates;
    if (gates === newGates || newGates.length === 0) {
      gates = newGates;
      return;
    }

    const newGateName: string = newGates[newGates.length - 1].name;
    if (!open && newGates.length > gates.length) {
      setOpen(true);
      gates = newGates;
      let gateName = gates[gates.length - 1].name;
      setName(gateName);
    }
  });

  const renameGate = async (newName: string) => {
    const gates = getWorkspace().gates;
    let gate = gates[gates.length - 1];

    gate.name = newName;
    WorkspaceDispatch.UpdateGate(gate);
    setOpen(false);
    try {
      const plots = getWorkspace().plots;
      let plot = plots[plots.length - 1];
      instancePlot(plot, gate);
    } catch {}
  };

  const quit = () => {
    setOpen(false);
    const gates = getWorkspace().gates;
    let gate = gates[gates.length - 1];
    WorkspaceDispatch.DeleteGate(gate);
  };

  const instancePlot = async (plot: Plot, gate: Gate) => {
    plot.gates = [...plot.gates, gate.id];
    plot.gatingActive = "";
    await WorkspaceDispatch.UpdatePlot(plot);
    let basedOffPlot = { ...plot };
    basedOffPlot.gates = [];
    await createSubpopPlot(basedOffPlot, [
      { gate: gate.id, inverseGating: false },
    ]);
    const popGates = getPopulation(plot.population).gates.map((e) => e.gate);
    for (let popGate of popGates) {
      let popIGate = getGate(popGate);
      popIGate.children.push(gate.id);
      WorkspaceDispatch.UpdateGate(popIGate);
    }
  };

  useEffect(() => {
    if (open === true) {
      const inp = document.getElementById("gate-name-textinput");
      if (inp !== null) {
        inp.focus();
      } else {
        setTimeout(() => {
          const inp = document.getElementById("gate-name-textinput");
          if (inp !== null) {
            inp.focus();
          }
        }, 50);
      }
    }
  }, [open]);

  return (
    <div
      onKeyDown={(e: any) => {
        if (e.code === "Enter") {
          renameGate(name);
        }
      }}
    >
      <Dialog open={open} aria-labelledby="form-dialog-title">
        <DialogTitle>Name Your Gate</DialogTitle>
        <DialogContent>
          <TextField
            error={nameError}
            value={name}
            helperText="This Field Is Required"
            autoFocus
            margin="dense"
            id="gate-name-textinput"
            label="Gate Name"
            type="email"
            onChange={(e: any) => {
              setName(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={quit} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (name === "" || name == null) {
                setNameError(true);
              } else {
                renameGate(name);
              }
            }}
            color="primary"
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
