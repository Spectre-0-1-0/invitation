import { serve } from "inngest/next";
import { inngest } from "../../../lib/inngest/client";
import { processMedia } from "../../../lib/inngest/functions/process-media";
import { processZip } from "../../../lib/inngest/functions/process-zip";

export const { GET, POST, PUT } = serve({
  client: inngest as any,
  functions: [
    processMedia as any,
    processZip as any
  ],
});
