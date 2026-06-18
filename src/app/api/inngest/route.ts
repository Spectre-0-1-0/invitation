import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { processMediaUpload, processZipExtraction } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processMediaUpload,
    processZipExtraction,
  ],
});
