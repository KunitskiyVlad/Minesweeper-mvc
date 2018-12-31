function Modell() {
    this.openCell = [];
    this.EmptyCell= [];
    this.Mine =[];
    this.genereMineX = [];
    this.genereMineY = [];
    this.NearCell =[];
    this.visibleMines =[];
    this.Time ={
        hour:0,
        minutes:0,
        second:0
    };
    this.intervalID= null;
    this._dispatcher = new EventDispatcher();
    this.gameStatus = null;
    this.countOpen = 0;
    this.countCell = 100;
    this.flag = 10;
    this.flagCell=[];
    this._allOpen =[];
}
Modell.STATUS_WIN     = "win";
Modell.STATUS_LOSE    = "lose";
Modell.STATUS_PLAYING = "playing";

Modell.prototype = {
    getOpenCell: function () {
        return this.openCell;
    },

    getMine: function () {
        return this.Mine;
    },

    getNearCell: function () {
        return this.NearCell;
    },

    getCurrentTime: function () {
        return this.Time;
    },
    getEmptyCell: function () {
        return this.EmptyCell;
    },
    getGameStatus: function () {
        return this.gameStatus;
    },
    getFlagCell: function () {
        return this.flagCell;
    },
    getFlagCount:function(){
        return this.flag;
},
    genereMine: function()
    {
        this.gameStatus = Modell.STATUS_PLAYING;
        for (var z=0; z<10; z++ )
        {
            this.genereMineX[z] = Math.floor(Math.random()*10);
            this.genereMineY[z] = Math.floor(Math.random()*10);
            var k=0;
            while (k!=z)
            {


                if(this.genereMineX[z] == this.genereMineX[k])
                {
                    this.genereMineX[z] = Math.floor(Math.random()*10);
                    k=0;
                }
                k++
            }
            var c=0;
            while (c!=z)
            {


                if(this.genereMineY[z] == this.genereMineY[c])
                {
                    this.genereMineY[z] = Math.floor(Math.random()*10);
                    c=0;
                }
                c++
            }
        var obj = {x:this.genereMineX[z], y:this.genereMineY[z]}
        this.Mine.push(obj);

        }

            return this.Mine;

    },

    Open: function (event) {
        if(this.gameStatus !== Modell.STATUS_PLAYING) {
            return;
        }
        var x = Number(event.data.x),
            y = Number(event.data.y);
        if(this.isFlag(x,y)) {
            return;
        }
        this.openCell = [];
        if (this.checkMine(x, y) === true) {
                this.OpenCell(y, x);
                this._dispatcher.dispatchEvent(new GameEvent(GameEvent.SEVERAL_CELLS_CHANGED, this.openCell));
            }
            else {

            this.showMines();

        }
        this._changeGameStatus();
        this._checkGameStatus();
    },
    checkMine: function(x,y)
    {


        for (var key=0;key<this.Mine.length; key++) {

            if(this.Mine[key].x === x  && this.Mine[key].y === y )
            {

                return false;
            }

        }

        return true;

    },
    findOpen : function (object,x,y) {
        var  flag = false;
        if(!object)
        {
            return false;
        }
        for (var i = 0; i <object.length; i++)
        {

            if (object[i].x === x && object[i].y === y)
            {
                return true;
            }
            else
            {
                flag = false;
            }
        }
        return flag;
    },
    findObject: function (object, x,y) {
        var  flag = false;
        x = Number(x);
        y = Number(y);

        for (var i = 0; i <object.length; i++)
        {

            if (object[i].x === x && object[i].y === y)
            {
                return object[i];
            }
            else
            {
                flag = false;
            }
        }
        return flag;
    },
    OpenCell: function (row, column) {
            row = Number(row);
            column = Number(column);
        if(this.isFlag(column,row)) {
            return;
        }
            var clicked = {x:column,y:row};
        if((this.findOpen(this._allOpen, column,row) === false)){
            this.countOpen++;
            this.openCell.push(clicked);
            this._allOpen.push(clicked);
        }

            if(this.IsNearCell(column,row) === true) {
               // this.countOpen++;
                var Cell = this.findObject(this.NearCell,column,row);
                this.openCell.push(Cell);
                return;
            }
               for (var j = row - 1; j <= row + 1; j++){
                for (var i = column - 1; i <= column + 1; i++){
                    if (i >= 0 && j >= 0 && i < 10 && j < 10 && !(j === row && i === column)  ) {
                        var obj = {x: i, y: j};
                        if((this.findOpen(this._allOpen, i,j) !== true ) ) {

                            if (this.checkMine(i,j) === true && this.IsNearCell(i,j) === false && this.isFlag(i,j) === false) {
                               // this.EmptyCell.push(obj);
                                this.countOpen++;
                                this.openCell.push(obj);
                                this._allOpen.push(obj);
                                this.OpenCell(j, i);
                            }
                            else if(this.isFlag(i,j) === false){
                                var NearCell = this.findObject(this.NearCell,i,j);
                                this.countOpen++;
                                this._allOpen.push(NearCell);
                                this.openCell.push(NearCell);
                            }
                        }
                    }
                }
            }

            return  this.openCell;
        },

    FindNeigbordCell : function (x, y) {
        x = Number(x);
        y = Number(y);

        for (var j = y - 1; j <= y + 1; j++){

            for (var i = x - 1; i <= x + 1; i++){

                if (i >= 0 && j >= 0 && i < 10 && j < 10 && !(j === y && i === x) && this.checkMine(i,j) === true) {
                        // this.openCell.Opened.push(clicked);
                        var temp = this.findObject(this.NearCell, i,j);
                        if(temp === false)
                        {
                            var obj = {x:i, y:j, count:+1};
                            this.NearCell.push(obj);
                        }
                        else
                        {
                            temp.count++;
                        }
                }
            }
        }
    },
    FindNearCell: function () {
        var Mine = this.getMine();

        for(var i=0;i<Mine.length;i++)
        {
            this.FindNeigbordCell(Mine[i].x,Mine[i].y)
        }
    },

    IsNearCell: function (x, y) {
        var flag = false;
        for (var i=0;i<this.NearCell.length;i++)
        {
            {

                if (this.NearCell[i].x === x && this.NearCell[i].y === y) {
                    flag =true;
                    return flag;
                }

            }

        }
        return flag;
    },

    isFlag: function(x,y)
        {
            var flag = false;
            if(this.flagCell.length <=0)
            {
                return flag;
            }
            for (var i=0;i<this.flagCell.length;i++)
            {
                {

                    if (this.flagCell[i].x === x && this.flagCell[i].y === y) {
                        flag =true;
                        return flag;
                    }

                }

            }
            return flag;
        },

    Timer: function () {
        this.InitTimer();
    },

    CountTime: function () {
        this.Time.second++;
        if(this.Time.second === 10)
        {
            this.Time.second=0;
            this.Time.minutes++;
        }
        if(this.Time.minutes === 10)
        {
            this.Time.minutes=0;
            this.Time.hour++;
        }
    },
    InitTimer: function () {
        var self = this;
        this.intervalID = setInterval(function()
        {
            self._dispatcher.dispatchEvent(new GameEvent(GameEvent.TIMER_VALUE_CHANGED));
             return self.CountTime();
        },1000);
    },

    getDispatcher: function () {
       return this._dispatcher;
    },

    _endGame: function () {
        this._stopTimer();

    this.showMines();
    this._dispatcher.dispatchEvent(new GameEvent(GameEvent.GAME_OVER));
    },

   _stopTimer: function () {
       clearTimeout( this.intervalID);
       this.intervalID = null;
   },
    showMines: function()
    {
        this.visibleMines = this.Mine.slice();
        this._dispatcher.dispatchEvent(new GameEvent(GameEvent.SEVERAL_CELLS_CHANGED, this.visibleMines));
    },
    _changeGameStatus: function () {
        if(this._win()) {
            this.gameStatus = Modell.STATUS_WIN;
        } else if(this._lose()){
           this.gameStatus = Modell.STATUS_LOSE;
        }else {
            this.gameStatus = Modell.STATUS_PLAYING;
        }
    },
    _win:function(){
        if((this.countOpen ===(this.countCell - this.Mine.length)) && this.visibleMines.length <=0) {
            console.log(true);
            return true;
        }
    },
    _lose: function()
    {
        if(this.visibleMines.length > 0) {
            return true;
        }
    },
    _checkGameStatus: function()
    {
        if(this.gameStatus === Modell.STATUS_WIN ||this.gameStatus === Modell.STATUS_LOSE)
        {
            this._endGame();
        }
    },
    setFlag: function (event) {
        if(this.gameStatus !== Modell.STATUS_PLAYING)
        {
            return;
        }


        var x = Number(event.data.x),
            y = Number(event.data.y);
        this.openCell = [];
        var obj ={x:x,y:y};

        if(this.isFlag(x,y))
        {
            var arrayFlag =this.getFlagCell();
            for(var i =0;i<arrayFlag.length;i++)
            {
                if(arrayFlag[i].x === x && arrayFlag[i].y === y) {
                    arrayFlag.splice(i,1);
                    this.openCell.push(obj);
                    this.flag++;
                    this._dispatcher.dispatchEvent(new GameEvent(GameEvent.FLAGS_COUNTER_CHANGED));
                    this._dispatcher.dispatchEvent(new GameEvent(GameEvent.SEVERAL_CELLS_CHANGED, this.openCell));
                }
            }


            return;
        }
        if(this.flag === 0)
        {
            return;
        }

        this.flag =this.flag-1;
        this.flagCell.push(obj);
        this.openCell.push(obj);
        this._dispatcher.dispatchEvent(new GameEvent(GameEvent.FLAGS_COUNTER_CHANGED));
        this._dispatcher.dispatchEvent(new GameEvent(GameEvent.SEVERAL_CELLS_CHANGED, this.openCell));
        this._changeGameStatus();
        this._checkGameStatus();

    },

    reset: function () {

        this.Mine =[];
        this.openCell = [];
        this.genereMineX = [];
        this.genereMineY = [];
        this.NearCell =[];
        this.visibleMines =[];
        this.Time ={
            hour:0,
            minutes:0,
            second:0
        };
        this._stopTimer();
        this._allOpen=[];
        this._dispatcher.dispatchEvent(new GameEvent(GameEvent.TIMER_VALUE_CHANGED));
        this.gameStatus = Modell.STATUS_PLAYING;
        this.countOpen = 0;
        this.countCell = 100;
        this.flag = 10;
        this.flagCell=[];
        this._dispatcher.dispatchEvent(new GameEvent(GameEvent.FLAGS_COUNTER_CHANGED));
        this._dispatcher = null;
        this._dispatcher = new EventDispatcher();
    }


}

