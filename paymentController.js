class PaymentController {

    // (Not tested)
    async callback(request, response) {
        try {
            const {id, status, amount} = request.query
            const result = await paymentService.doSomething(id, status, amount)
            return response.json(result)
        } catch (error) {
            console.log(error)
            response.status(400).json({message: 'Get callback error: ' + error.message})
        }
    }

    // Special for test payment invoce
    async payInvoce(request, response) {
        try {
            let res = await fetch('https://demo-paygate.steaminventoryhelper.com/invoice', {
                method: 'POST'
            })
            let result = await res.json()
            console.log(result)
            return response.json(result)
        } catch (error) {
            console.log(error)
            response.status(400).json({message: 'Get payInvoce error: ' + error.message})
        }
    
    }

}

export default new PaymentController()