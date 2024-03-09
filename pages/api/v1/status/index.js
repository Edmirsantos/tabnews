import database from "infra/database.js" 


async function status(request, response){
    const updateAt = new Date().toISOString();
    
    const databaseName = request.query.databaseName;
    
    console.log(`Banco de dados selecionado: ${databaseName}`)
    const databaseVersionResult = await database.query("SHOW server_version;")
    const databaseVersionValue = databaseVersionResult.rows[0].server_version;

    const databaseMaxConnectionsResult = await database.query("SHOW max_connections;")
    const databaseMaxConnectionsValue = databaseMaxConnectionsResult.rows[0].max_connections;

    const databaseOpennedConnectionsResult = await database.query(
        `SELECT count(*)::int FROM pg_stat_activity WHERE datname = '${databaseName}' AND state = 'active';`
    );
    
       
        //"SELECT count(*)::int FROM pg_stat_activity WHERE datname = 'local_db';"
    const databaseOppenedConnectionsValue = databaseOpennedConnectionsResult.rows[0].count;

    response.status(200).json({
        update_at: updateAt,
        dependencies: {
            database: {
                version: databaseVersionValue,
                max_connections: parseInt(databaseMaxConnectionsValue),
                opened_connections: databaseOppenedConnectionsValue
            }
        }
    });
}

export default status;