const router = require("express").Router();
const {
  addMessage,
  getMessage,

} = require("../controller/MesagesController");


router.post('/addMessages',addMessage)
router.post('/getMessages',getMessage)


module.exports = router;
