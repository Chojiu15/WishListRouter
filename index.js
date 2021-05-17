const express = require("express");
const app = express();
app.use(express.json());
const port = 3002;
const wishListRouter = require('./routes/wishlistRouter')

app.use('/', wishListRouter)


app.listen(port, console.log(`server listening on port ${port}`));
