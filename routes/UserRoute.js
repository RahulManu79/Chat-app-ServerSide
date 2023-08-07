const router = require("express").Router()


const {
  register,
  login,
  setAvatar,
  findUsers,
  logOut,
} = require("../controller/UserController");


router.post("/register",register)
router.post("/login",login)
router.post("/setAvatar/:id",setAvatar)
router.get("/allUsers/:id",findUsers)
router.get("/allUsers/:id",findUsers)
router.get("/logout/:id", logOut);



module.exports = router