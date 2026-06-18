import fs from 'fs';
import path from 'path';
import { FormData, File } from 'formdata-node';
import { fileByPath } from 'formdata-node/lib/fileByPath';

const API_URL = process.env.API_URL || 'http://localhost:3000';
const EVENT_ID = process.env.EVENT_ID || 'test-event-id';

async function runTest(count) {
  console.log(`Starting Stress Test: ${count} uploads...`);
  const startTime = Date.now();
  let success = 0;
  let failure = 0;

  // Create a dummy file
  const dummyFilePath = './dummy-photo.jpg';
  fs.writeFileSync(dummyFilePath, 'dummy data for stress test');

  // 1. Create Upload Batch
  const batchRes = await fetch(`${API_URL}/api/admin/media/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventId: EVENT_ID, totalFiles: count })
  });
  const { uploadId } = await batchRes.json();
  console.log(`Batch Created: ${uploadId}`);

  const uploads = [];
  for (let i = 0; i < count; i++) {
    const promise = (async () => {
      try {
        const formData = new FormData();
        const file = await fileByPath(dummyFilePath, `photo-${i}.jpg`, { type: 'image/jpeg' });
        formData.append('file', file);
        formData.append('eventId', EVENT_ID);
        formData.append('uploadId', uploadId);

        const res = await fetch(`${API_URL}/api/admin/media/upload/file`, {
          method: 'POST',
          body: formData,
        });

        if (res.ok) success++;
        else failure++;
      } catch (err) {
        failure++;
        console.error(`Upload ${i} failed:`, err.message);
      }
    })();
    uploads.push(promise);

    // Concurrency limit to avoid overwhelming local dev server
    if (uploads.length % 10 === 0) {
        await Promise.all(uploads);
    }
  }

  await Promise.all(uploads);
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;

  console.log('--- TEST REPORT ---');
  console.log(`Total Count: ${count}`);
  console.log(`Success: ${success}`);
  console.log(`Failure: ${failure}`);
  console.log(`Success Rate: ${(success / count * 100).toFixed(2)}%`);
  console.log(`Total Duration: ${duration}s`);
  console.log(`Avg Time per Upload: ${(duration / count).toFixed(4)}s`);
  console.log('-------------------');

  fs.unlinkSync(dummyFilePath);
}

const count = parseInt(process.argv[2]) || 100;
runTest(count).catch(console.error);
