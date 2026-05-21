/**
 * PAPER ORM SYSTEM
 * Object-Relational Mapping for Paper.js
 */

class PaperModel {
    constructor(data = {}) {
        Object.assign(this, data);
    }

    // Instance method for saving to DB
    save() {
        const cname = this.constructor.name.toLowerCase() + 's';
        if (this.id) {
            paper.db(cname).update(this.id, this);
        } else {
            let record = paper.db(cname).insert(this);
            this.id = record.id;
        }
        return this;
    }

    // Instance method for deleting from DB
    delete() {
        const cname = this.constructor.name.toLowerCase() + 's';
        if (this.id) {
            paper.db(cname).delete(this.id);
        }
    }

    // Static CRUD methods
    static create(data) {
        const instance = new this(data);
        return instance.save();
    }

    static find(id) {
        const cname = this.name.toLowerCase() + 's';
        const data = paper.db(cname).find(id);
        return data ? new this(data) : null;
    }

    static all() {
        const cname = this.name.toLowerCase() + 's';
        return paper.db(cname).state.value.map(data => new this(data));
    }

    static watch(callback) {
        const cname = this.name.toLowerCase() + 's';
        return paper.db(cname).watch(dataList => {
            callback(dataList.map(data => new this(data)));
        });
    }
}

// Global exposure
paper.model = PaperModel;
