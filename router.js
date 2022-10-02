import Router            from "express"
import itemController    from "./itemController.js"
import paymentController from "./paymentController.js"

const router = new Router()

router.get('/v1/items', itemController.getItems)

router.post('/payment', paymentController.payInvoce)
router.post('/callback', paymentController.callback)

router.get('/', (request, response) => {
    response.json({ info: 'https://docs.skinport.com/#items' })

})

export default router