import {
  __async
} from "./chunk-DJRN6NKF.mjs";
import { logger } from "@genkit-ai/core/logging";
import { GoogleAuth } from "google-auth-library";
function credentialsFromEnvironment() {
  return __async(this, null, function* () {
    let authClient;
    let options = {};
    if (process.env.GCLOUD_SERVICE_ACCOUNT_CREDS) {
      const serviceAccountCreds = JSON.parse(
        process.env.GCLOUD_SERVICE_ACCOUNT_CREDS
      );
      const authOptions = { credentials: serviceAccountCreds };
      authClient = new GoogleAuth(authOptions);
      options.credentials = yield authClient.getCredentials();
    } else {
      authClient = new GoogleAuth();
    }
    try {
      const projectId = yield authClient.getProjectId();
      if (projectId && projectId.length > 0) {
        options.projectId = projectId;
      }
    } catch (error) {
      logger.warn(error);
    }
    return options;
  });
}
export {
  credentialsFromEnvironment
};
//# sourceMappingURL=auth.mjs.map