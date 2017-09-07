
/**
 * Couch DB
 * Exposes CouchDB interface
 */

function couchDB(args) {
    this.nano = args.nano;
    this.db   = this.nano.use(args.db);

    this.db.update = function(fields, id, cb) {
        var db = this;
        if(id==null) {
            cb(new Error("Document ID is null"));
        } else {
            db.get(id, function (error, exist) {
                if(!error) {
                    for(var f in fields) {
                        exist[f]=fields[f];
                    }
                    db.insert(exist, id, cb);
                } else {
                    console.log(error);
                    console.log(JSON.stringify(fields) + " " + id);
                    cb(error);
                }
            });
        }
    };

    this.db.updateFields = function(fields, id, cb) {
        var db = this;
        if(id==null) {
            cb(DEF.GENERAL_ERROR);
        } else {
            db.insert(fields, id, function(err, body) {
                cb(err);
            });
        }
    }
}


couchDB.prototype.setDB = function(database) {
    this.db = this.nano.use(database);
};


couchDB.prototype.getDB = function() {
    return this.db;
};

couchDB.prototype.addAttachment = function(docId, filename, fileData, mimeType, cb) {
    var _db = this.db;
    this.db.get(docId, {revs_info: true}, function(err, body) {
        if (!err) {

            _db.attachment.insert(docId,filename,fileData,mimeType,{rev: body._rev},function(err,body){
               cb(err,body);
            });

        } else {
            utils.logError("[addAttachment] error " + JSON.stringify(err));
            cb(err);
        }
    });
};

couchDB.prototype.getDBinfo = function(name, cb) {
    this.nano.db.get(name, function (err, res) {
        if (!err) {
            cb(err, res);
        } else {
            cb(err);
        }
    });
};


couchDB.prototype.createDOC = function(fields, cb) {

    this.db.insert(fields,'', function(err, body) {
        cb(err, body);
    });
};


couchDB.prototype.get = function(id, includeDocs, cb) {

    this.db.get(id, {revs_info: true, include_docs: includeDocs}, function(err, body) {
        if (!err) {
            cb(err, body);
        } else {
            cb(err);
        }
    });
};


couchDB.prototype.fetch = function(ids, cb) {

    this.db.fetch(ids, {revs_info: true, include_docs: true}, function(err, body) {
        if (!err) {
            cb(err, body);
        } else {
            cb(err);
        }
    });
};


couchDB.prototype.getView = function(design, view, queryOptions, cb) {
    this.db.view(design, view, queryOptions, function (err, body) {
        if(err) {
            cb(err);
        } else {
            cb(err, body);
        }
    });
};


couchDB.prototype.getViewWithReduceCount = function (design, view, queryOptions, cb) {
    var qReduce = JSON.parse(JSON.stringify(queryOptions));
    qReduce.reduce = true;
    qReduce.include_docs = false;
    if (qReduce.skip !== undefined) delete qReduce.skip;
    if (qReduce.limit !== undefined) delete qReduce.limit;
    var _db = this.db;
    _db.view(design, view, qReduce, function (errReduce, bodyReduce) {
        if (errReduce) {
            if (typeof cb === 'function') cb(errReduce);
        } else {
            var total_filtered_count = 0;
            if (bodyReduce.rows.length == 1) {
                total_filtered_count = bodyReduce.rows[0].value;
            }
            queryOptions.reduce = false;
            _db.view(design, view, queryOptions, function (errQuery, bodyQuery) {
                if (errQuery) {
                    if (typeof cb === 'function') cb(errQuery);
                } else {
                    bodyQuery.total_filtered_count = total_filtered_count;
                    if (typeof cb === 'function') cb(errQuery, bodyQuery);
                }
            });
        }
    });
};


couchDB.prototype.delete = function(id, cb) {
    var _db = this.db;
    this.db.get(id, {revs_info: true}, function(err, body) {
        if (!err) {
            _db.destroy(id, body._rev, function (err) {
                cb(err);
            });
        } else {
            console.log(err);
            cb(err);
        }
    });
};


couchDB.prototype.modify = function(fields, id, cb) {

    fields.lastModified = new Date();
    this.db.update(fields, id, function(err) {
        cb(err);
    });
};


couchDB.prototype.modifyWithHandler = function(design, handler, id, fields, cb) {
    fields.lastModified = new Date();
    this.db.updateWithHandler(design, handler, id, fields, function (err, resp){
        if(err) {
            console.log(err);
            cb(err, resp);
        }
        else {
            cb(err, resp);
        }
    })
};


couchDB.prototype.delField = function(id, field, cb) {

    var not_found = true;
    var _db = this.db;
    this.db.get(id, function(err, doc) {
        if (!err) {
            for(var val in doc) {
                if (val == field) {
                    not_found = false;
                    delete doc[val];
                    //  LOG.L.debug("[delField] " + JSON.stringify(doc));
                    _db.updateFields(doc, id, function(err) {
                        cb(err);
                    });
                }
            }
            if(not_found) {
                cb();
            }
        } else {
            cb();
        }
    });
};


couchDB.prototype.list = function(params, cb) {

    this.db.list(params, function(err, body) {

        if (!err) {
            cb(err, body);
        } else {
            console.log("[CouchDB::list] error " + JSON.stringify(err));
            if(err.errno == "ECONNREFUSED") {
                console.log('[CouchDB::list] ECONNREFUSED DB Error, so try different connection');
            }
            cb(err, body);
        }
    });
};


couchDB.prototype.bulk = function(fields, cb) {
    this.db.bulk(fields,function (err) {
        cb(err);

    });
};


module.exports = couchDB;