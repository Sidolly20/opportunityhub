import { runIngestion } from "../lib/fetcher";

runIngestion()
  .then((r) => {
    console.log(JSON.stringify(r, null, 2));
    if (r.errors.length > 0 && r.saved === 0) process.exit(1);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
