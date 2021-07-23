const router = require('express').Router()
const roomieController = require('../controllers/roomie.controller')
const { auth } = require('../utils/middlewares')

router.route('/signup').post(roomieController.signup)
router.route('/signin').post(roomieController.signin)
router.route('/profile').get(auth, roomieController.show)
router.route('/profile').put(auth, roomieController.update)
router.route('/').get(roomieController.list)


module.exports = router