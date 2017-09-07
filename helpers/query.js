
/**
 * Helper: Query
 */

function queryOptions() {
    this.key;
    this.keys;
    this.startkey;
    this.startkey_docid;
    this.endkey;
    this.endkey_docid;
    this.limit;
    this.stale;
    this.descending;
    this.skip;
    this.group;
    this.group_level;
    this.reduce;
    this.include_docs;
    this.inclusive_end;
    this.update_seq;
    this.attachments;
}

queryOptions.prototype.normalize = function() {

    this.res = {};

    if ( this.key !== undefined ) {
        this.res.key = this.key;
    }

    if ( this.keys !== undefined ) {
        this.res.keys = this.keys;
    }

    if ( this.startkey !== undefined ) {
        this.res.startkey = this.startkey;
    }

    if ( this.startkey_docid !== undefined ) {
        this.res.startkey_docid = this.startkey_docid;
    }

    if ( this.endkey !== undefined ) {
        this.res.endkey = this.endkey;
    }

    if ( this.endkey_docid !== undefined ) {
        this.res.endkey_docid = this.endkey_docid;
    }

    if ( this.limit !== undefined ) {
        this.res.limit = this.limit;
    }

    if ( this.stale !== undefined ) {
        this.res.stale = this.stale;
    }

    if ( this.group_level !== undefined ) {
        this.res.group_level = this.group_level;
    }

    if ( this.descending !== undefined ) {
        this.res.descending = this.descending;
    }

    if ( this.skip !== undefined ) {
        this.res.skip = this.skip;
    }

    if ( this.group !== undefined ) {
        this.res.group = this.group;
    }

    if ( this.reduce !== undefined ) {
        this.res.reduce = this.reduce;
    }

    if ( this.include_docs !== undefined ) {
        this.res.include_docs = this.include_docs;
    }

    if ( this.inclusive_end !== undefined ) {
        this.res.inclusive_end = this.inclusive_end;
    }

    if( this.update_seq !== undefined ) {
        this.res.update_seq = this.update_seq;
    }

    if(this.attachments !== undefined) {
        this.res.attachments = this.attachments;
    }

    return this.res;
};


module.exports = queryOptions;