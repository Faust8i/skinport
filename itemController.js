 import itemService from "./itemService.js"

class ItemController {
   
    async getItems(request, response) {
        try {
            const {app_id, currency, tradable} = request.query
            const items = await itemService.getItems(app_id, currency, tradable)
            return response.json(items)
        } catch (error) {
            console.log(error)
            response.status(400).json({message: 'Get items error: ' + error.message})
        }
    }

}

export default new ItemController()