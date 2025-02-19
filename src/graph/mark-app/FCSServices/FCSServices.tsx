import fcsModel from "./fcsTransformer/fcsModel";
import MarkLogicle from "../logicleMark";
import { parseAndUpload } from "./fcsTransformer/node-handler";

class FCSServices {
  loadFileMetadata(file: Buffer, eventsToRead: number) {
    return fcsModel
      .getFCS({
        file: file,
        eventsToRead: eventsToRead,
        skip: true,
      })
      .then(function (parsedFcsFile) {
        //let fileEvents = parseAndUpload({}, fcsFile, 123456, 987654, false);

        // channels: channels,
        // jsonEventCount: fileData.length,
        // events: fileData,
        // scale: scale,
        // paramNamesHasSpillover: paramNamesHasSpillover,

        let fileData = {
          channels: parsedFcsFile.channels,
          events: parsedFcsFile.events,
          scale: parsedFcsFile.scale,
          paramNamesHasSpillover: parsedFcsFile.paramNamesHasSpillover,
          origEvents: parsedFcsFile.origEvents,
          channelMaximums: parsedFcsFile.channelMaximums,
          text: parsedFcsFile.text,
          meta: parsedFcsFile.meta,
        };

        return fileData;
      })
      .catch(function (err) {
        throw err;
      });
  }

  logicleT = 262144;
  logicleM = 4.5;
  logicleW = 0;
  logicleA = 0;

  logicleMetadataSetter(params: {
    T: number;
    M: number;
    W: number;
    A: number;
  }) {
    const { T, M, W, A } = params;
    this.logicleT = T;
    this.logicleM = M;
    this.logicleW = W;
    this.logicleA = A;
  }

  logicleMarkTransformer(
    data: number[] | Float32Array,
    rangeBegin?: number,
    rangeEnd?: number
  ): Float32Array {
    const logicle = new MarkLogicle(rangeBegin, rangeEnd);
    return new Float32Array(data.map((e: any) => logicle.scale(e)));
  }

  logicleInverseMarkTransformer(
    data: number[],
    rangeBegin?: number,
    rangeEnd?: number
  ): number[] {
    const logicle = new MarkLogicle(rangeBegin, rangeEnd);
    return data.map((e) => logicle.inverse(e));
  }
}

export default FCSServices;
