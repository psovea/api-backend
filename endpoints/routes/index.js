var router = (app) => {
  app.get("/", (req, res) => {
    res.status(200).send({});
  })
}

module.exports = router;
