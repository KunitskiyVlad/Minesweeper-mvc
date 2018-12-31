function SyntheticEvent(type, data) {
    this.type = null;
    this.data = data || null;
    this._setType(type);
}

SyntheticEvent.prototype._setType = function(type) {
    this.type = type;
};
