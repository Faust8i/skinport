import Pool                 from 'pg'
import connectConfig        from './connectConfig.js'

const pool = new Pool.Pool({
    user:     connectConfig.user,
    host:     connectConfig.host,
    database: connectConfig.database,
    password: connectConfig.password,
    port:     connectConfig.port,
})

class DAO {

    async getItems(app_id, currency, tradable) {
        // app_id - not use
        // tradable - correct use?
        const query = `
            SELECT json_agg(row_to_json(n_items)) 
            FROM (
                SELECT market_hash_name
                    , currency
                    , suggested_price
                    , item_page
                    , market_page
                    , min_price
                    , max_price
                    , mean_price
                    , quantity
                    , created_at
                    , updated_at
                FROM items
                WHERE currency = '${currency}'
                ${tradable==true ? 'and quantity > 0' : ''}
                ) n_items`
        const items = await pool.query(query)
        return (items.rowCount) ? items.rows[0].json_agg : null
    }

}

export default new DAO()