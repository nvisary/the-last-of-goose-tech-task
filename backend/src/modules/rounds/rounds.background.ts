import { updateRoundStatuses } from "./rounds.service";

const UPDATE_INTERVAL = 1000;

export const startRoundStatusUpdater = () => {
  console.log("Starting round status updater...");
  setInterval(async () => {
    try {
      await updateRoundStatuses();
    } catch (error) {
      console.error("Error updating round statuses:", error);
    }
  }, UPDATE_INTERVAL);
};
