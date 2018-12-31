function ControllerDOM(view, model) {
    this.view =  view;
    this.model = model;
    this._setEventToView();
}


ControllerDOM.prototype = {

    CreateGame : function () {
        this.model.Timer();
    },
    GetMine : function () {
        this.model.genereMine();
        this.model.FindNearCell();
    },
    Open: function(event) {

        this.model.Open(event);
    },

    setFlag: function(event) {

        this.model.setFlag(event);
    },

    ShowMine: function () {
        var Mine = this.model.genereMine();

        this.view.PaintMine(Mine);
        var table = this.view.getTable();
    },

    restart: function() {

    this.model.reset();
    this.model.Timer();
    this.view.removeGameField();
    this.view.CreateTable(10,10);
    this.view.setFace('NormalFace');
    this.view._addFieldEventListener();
    this.view._preventContextMenuOnField();
    this.model.genereMine();
    this.model.FindNearCell();


    },

    Debug: function()
    {
       var Mine = this.model.getMine();
       this.view.ShowMineForDebug(Mine);
    },

    _setEventToView: function()
    {
        var dispatcher = this.view.getDispatcher();
        var that       = this;
        dispatcher.addEventListener(GameEvent.CLICK_TO_FIELD_LEFT, function(event) {
            that.Open(event);
        });
        dispatcher.addEventListener(GameEvent.CLICK_TO_FIELD_RIGHT, function(event) {
            that.setFlag(event);
        });
        dispatcher.addEventListener(GameEvent.NEW_GAME, function(event) {
            that.restart();
        });
        /*dispatcher.addEventListener(GameEvent.CLICK_TO_DEBUG_MENU, function(event) {
            that.Debug();
        });*/

    },
}