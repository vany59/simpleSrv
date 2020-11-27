const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const db = require("./db.json");

const DB_PATH = `${__dirname}/db.json`;

class database {
  constructor(table) {
    this.db = db[table];
    this.tableName = table;
  }
  find(query = {}) {
    const keys = Object.keys(query);
    if (keys.length) {
      let _db = this.db;
      keys.forEach((key) => {
        _db = _db.filter((item) => item[key] === query[key]);
      });
      return _db;
    } else {
      return this.db;
    }
  }

  findOne(query = {}) {
    const _db = this.find(query);
    return _db.length ? _db[0] : null;
  }

  save(item) {
    const { _id } = item;
    if (!_id) {
      this.db.push({ _id: uuid.v4(), ...item });
    } else {
      const index = this.db.findIndex((item) => item._id === _id);
      if (index < 0) {
        this.db.push({ ...item });
      } else {
        this.db[index] = { ...this.db[index], ...item };
      }
    }

    db[this.tableName] = this.db;
    fs.writeFileSync(DB_PATH, JSON.stringify(db));
  }
}

module.exports = database;
