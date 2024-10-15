import {
  __async,
  __spreadValues
} from "./chunk-DJRN6NKF.mjs";
import { LoggingWinston } from "@google-cloud/logging-winston";
let additionalStream;
class GcpLogger {
  constructor(config) {
    this.config = config;
  }
  getLogger(env) {
    return __async(this, null, function* () {
      const winston = yield import("winston");
      const format = this.shouldExport(env) ? { format: winston.format.json() } : {
        format: winston.format.printf((info) => {
          return `[${info.level}] ${info.message}`;
        })
      };
      let transports = [];
      transports.push(
        this.shouldExport(env) ? new LoggingWinston({
          projectId: this.config.projectId,
          labels: { module: "genkit" },
          prefix: "genkit",
          logName: "genkit_log",
          credentials: this.config.credentials
        }) : new winston.transports.Console()
      );
      if (additionalStream) {
        transports.push(
          new winston.transports.Stream({ stream: additionalStream })
        );
      }
      return winston.createLogger(__spreadValues({
        transports
      }, format));
    });
  }
  shouldExport(env) {
    return this.config.telemetry.export;
  }
}
function __addTransportStreamForTesting(stream) {
  additionalStream = stream;
}
export {
  GcpLogger,
  __addTransportStreamForTesting
};
//# sourceMappingURL=gcpLogger.mjs.map