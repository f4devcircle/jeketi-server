const Datastore = require('@google-cloud/datastore');

class DataStore {
  constructor(namespace) {
    this.DATASTORE_NAMESPACE = namespace;
    this.datastore = new Datastore({
      namespace: this.DATASTORE_NAMESPACE,
      keyFilename: './f4_Dev_Circle-8dc57990bab6.json',
      kind: 'default'
    });
  }

  queryDatastore(kind, filters) {
    let query = this.datastore.createQuery(kind);
    filters.forEach((filter) => {
      query = query.filter(...filter);
    });
    return this.datastore.runQuery(query).then(data => data[0]);
  }

  queryDatastoreByKeys(kind, ids) {
    const keys = ids.map(id => this.datastore.key([kind, id]));
    return this.datastore.get(keys).then(data => data[0]);
  }

  getByKey(kind, id) {
    return this.queryDatastoreByKeys(kind, [id]).then(data => data[0]);
  }

  insert(kind, key, data) {
    return this.datastore.upsert({
      key: this.datastore.key([kind, key]),
      data,
    });
  }
}

module.exports = DataStore