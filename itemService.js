import config from "./config.js"
import DAO    from "./DAO.js"

class ItemService {

    requestTimers      = []
    count_Requests     = 1
    cashe              = new Map()
    casheTimers        = new Map()

    async getItems(app_id   = config.def_app_id, 
                   currency = config.def_currency, 
                   tradable = config.def_tradable) {
        
        // TODO: rewrite to middleware chech
        if ( !config.SUPPORTED_CURRENCIES.includes(currency.toUpperCase()) ) {
            // TODO: rewrite to new extend error class
            throw new Error('400: Invalid request: not supported currency.')
        }

        let currentTime = Date.now()

        // Checking count requests times on our timer
        this.requestTimers = this.requestTimers.filter(item => 
            ((currentTime - item) / 1000/60/60) <= config.CASHE_ITEMS_EXPIRED_TIME) || []
        if (this.requestTimers.length >= config.MAX_COUNT_IN_TIME_REQUESTS) {
            throw new Error('429: Rate limit exceeded')
        } else {
            this.requestTimers.push(currentTime)
        }
        
        // Geting data + cashing
        let cashedRequest = {app_id, currency, tradable}
        let cashedTime    = this.casheTimers.get(cashedRequest) || 0
        let oldDataItem   = ((currentTime - cashedTime) / 1000/60/60) > config.CASHE_ITEMS_EXPIRED_TIME
        
        // TODO: may be rewrite to 5m-timers...
        if (oldDataItem) {
            this.cashe.delete(cashedRequest)
            this.casheTimers.delete(cashedRequest)
        }

        let hasCashed = this.cashe.has(cashedRequest)
        if (!hasCashed) {
            const data = DAO.getItems(app_id, currency.toUpperCase(), tradable)
            this.cashe.set(cashedRequest, data)
            this.casheTimers.set(cashedRequest, currentTime)
        }
        return this.cashe.get(cashedRequest)
    }

}

export default new ItemService()