class Model {
  _db;
  _table;

  constructor(db, table) {
    if (!db || !table) {
      throw new Error("Failed to initialize Model");
    }

    this._db = db;
    this._table = table;
  }

  query(statement, params = []) {
    return new Promise((resolve, reject) => {
      this._db._conn.query(statement, params, (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  /**
   *  common queries that should be present on all modal instances
   * 
  */
  async find(id) {
    const query = `
    SELECT * FROM ${this._table} 
    WHERE id = ?
    LIMIT 1;
    `;

    const [result] = await this.query(query, [id]); 
    return result;
  }
};

export default Model;