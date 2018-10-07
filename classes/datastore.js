const Datastore = require('@google-cloud/datastore');

class DataStore {
  constructor(namespace) {
    this.DATASTORE_NAMESPACE = namespace;
    this.datastore = new Datastore({
      namespace: this.DATASTORE_NAMESPACE,
    });
  }

  queryDatastore(kind, filters) {
    let query = this.datastore.createQuery(kind);
    filters.forEach((filter) => {
      query = query.filter(...filter);
    });
    return this.datastore.runQuery(query).then(data => data[0]);
  }

  insert(key, data) {
    return this.datastore.upsert({
      key: this.datastore.key(key),
      data,
    });
  }
}

module.exports = DataStore