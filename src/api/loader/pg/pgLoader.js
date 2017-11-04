/**
 * Postgresql Loader use dataloader to batch sql queries
 * @flow
 */
import type { TableSinglePrimaryKey } from '../../TypeDefinition';

function indexResults(results, indexField, cacheKeyFn = key => key) {
  const indexedResults = new Map();
  results.forEach(res => {
    indexedResults.set(cacheKeyFn(res[indexField]), res);
  });
  return indexedResults;
}

function normalizeResults(keys, indexField, cacheKeyFn = key => key) {
  return results => {
    const indexedResults = indexResults(results, indexField, cacheKeyFn);
    return keys.map(val => indexedResults.get(cacheKeyFn(val)) || null);
    //new Error(`Key not found : ${val}`));
  };
}

const pgLoader = async (
  client: Object,
  table: TableSinglePrimaryKey,
  ids: Array<string>,
  key?: string,
) => {
  key = key || table.primaryKey;

  const where = ids.map(id => `'${id}'`).join(' , ');

  const sql = `select ${Object.keys(table.fields).join(
    ' , ',
  )} from ${table.tableName} where ${key} in (${where})`;

  // console.log('pg loader sql: ', sql);
  // const TAG = `${table.tableName}-${Math.random()}`;
  // console.time(TAG);
  const result = await client.query(sql, []);
  // console.timeEnd(TAG);

  const { rows } = result;

  // order rows by ids
  return normalizeResults(ids, key, id => id.toString())(rows);
};

export default pgLoader;