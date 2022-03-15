let express = require("express");

const PORT = process.env.PORT || 8000;

let app = express();

app.use(express.static("static"))

app.listen(PORT, () => `server listening on http://localhost:${PORT}`)