const app = require('./backend/app');

const server = app.listen(process.env.PORT || 8080,  () => {
  let port = server.address().port;
  console.log("App now running on port", port);
});
