function DOMView(game)
{
     this.table = null;
     this.row = null;
     this.td = null;
     this.game = game;
     this.panel = null;
     this.img =null;
    this._dispatcher = new EventDispatcher();
    this.CreateContainer();
    this.PaintPanel();
    this.CreateTable(10,10);
    this.CreateTimer();
    this.CreateFlagCounter();
    //this.DebugMenu();
    this.checkWidthPanel();
    this._preventContextMenuOnField();
    this._addFieldEventListener();

}
DOMView.DEATHFACE = 'DeathFace';
DOMView.NORMALFACE = 'NormalFace';
DOMView.SURPRISEDFACE = 'SurprisedFace';
DOMView.prototype = 
    {
        CreateTable : function (row, column) {
            this.table = document.createElement('table');
           var container = document.getElementById('container');

            for(var y=0; y <row;y++)
            {
                this.row = document.createElement('tr');

                for (var x=0; x<column; x++)
                {
                   this.td = document.createElement('td');
                    this.td.dataset.y=y;
                    this.td.dataset.x=x;
                    //this.td.innerText=field[y][x];
                    this.row.appendChild(this.td);
                }
                this.table.appendChild(this.row);
            }
            this.table.align = 'center';
            container.appendChild(this.table)
    },

    ListenEventClick: function(method)
    {

        this.table.addEventListener('click',method() );
    },

      getTable: function()
      {
          return this.table;
      },

      getPanel: function () {
          return this.panel;
      },

      getDispatcher: function()
      {
          return this._dispatcher;
      },

      resign: function(Table, ClassName,x,y, text)
      {
          if(!text)
          {
              text='';
          }

              this.table.querySelector('td[data-y='+'"'+y+'"]'+'[data-x='+'"'+x+'"]').className = ClassName;
              this.table.querySelector('td[data-y='+'"'+y+'"]'+'[data-x='+'"'+x+'"]').innerText = text;

      },

     PaintPanel: function()
     {
          this.panel = document.createElement('div');
         this.img = document.createElement('img');
         var smileFace =document.createElement('div'),

             container = document.getElementById('container');
         this.panel.className= 'panel';
         this.panel.id='panel'
         this.img.src = 'image/NormalFace.png';
         smileFace.className='face-emotion';
         smileFace.appendChild(this.img);
         this.panel.appendChild(smileFace);
         container.appendChild(this.panel);


     },

    CreateContainer: function () {
        var container = document.createElement('div');
        container.id='container';
        container.className='container';
        document.body.appendChild(container);
    },

     CreateTimer: function () {
         var Timer = document.createElement('div'),
             hour = document.createElement('span'),
             minutes =document.createElement('span'),
             seconds =document.createElement('span'),
             panel = document.getElementById('panel'),
             that = this;
         hour.id ='hour';
         minutes.id='minutes';
         seconds.id = 'seconds';
         Timer.className ='timer';
         Timer.appendChild(hour);
         Timer.appendChild(minutes);
         Timer.appendChild(seconds);
         panel.appendChild(Timer);
     },
        
      ChangeTimer: function () {
            var hour = document.getElementById('hour'),
                minutes=document.getElementById('minutes'),
                seconds = document.getElementById('seconds'),
                Time = this.game.getCurrentTime();
           hour.innerText = Time.hour;
          minutes.innerText = Time.minutes;
          seconds.innerText = Time.second;
      },

      CreateFlagCounter: function () {
          var flagCount = document.createElement('div'),
              panel = document.getElementById('panel'),
              that = this,
              count = this.game.getFlagCount(),
              value = document.createElement('span');
          value.id ='value';
          value.innerText = count;
          flagCount.className ='flag-count';
          flagCount.appendChild(value);
          var dispatcher = this.game.getDispatcher();
          panel.appendChild(flagCount);
      },

      DebugMenu: function () {
          this.buttonShowMine  = document.createElement('button');
         var panel = document.getElementById('panel');
          this.buttonShowMine.innerText ='Показать мины для дебага';
          panel.appendChild(this.buttonShowMine);
      },
      ShowMineForDebug: function (field) {
          for (var x = 0; x < field.length; x++) {
              this.resign(this.table, '', field[x].x, field[x].y, 'M');
          }

      },
      changeValueFlag: function () {
        var value = document.getElementById('value'),
        count = this.game.getFlagCount();
        value.innerText = count;
      },

      checkWidthPanel: function () {
          var width = this.getTable().offsetWidth;
          this.panel.style.width = width+'px';

      },

        _addFieldEventListener : function() {
            var that = this,
            dispatcher = this.game.getDispatcher();
            this.table.addEventListener("mouseup", function(event) {
                var target = event.target;
                that.setFace(DOMView.NORMALFACE);
                if(target.classList.contains('empty-cell'))
                {
                    return;
                }
                if(event.which === 1)
                {
                    that.addEventLeftClick(event)

                }
                if (event.which === 3){
                    that.addEventRightClick(event);

                }
            });
            this.table.addEventListener("mousedown", function(event) {
                var target = event.target;
                if(target.classList.contains('empty-cell'))
                {
                    return;
                }
                if(event.which !== 1)
                {
                    return

                }
                that.setFace(DOMView.SURPRISEDFACE);

            });
            dispatcher.addEventListener(GameEvent.SEVERAL_CELLS_CHANGED, function(event) {
                that.redrawField(event.data);
            });
            dispatcher.addEventListener(GameEvent.TIMER_VALUE_CHANGED, function(event) {
                that.ChangeTimer();
            });
            dispatcher.addEventListener(GameEvent.GAME_OVER, function(event) {
                var text = that.gameStatus();
                 var accept = confirm(text+'.Restart game');
                 if(accept)
                 {
                     that._dispatcher.dispatchEvent(
                         new GameEvent(GameEvent.NEW_GAME)
                     );
                 } else {
                     alert(':(');
                 }
            });
           /* this.buttonShowMine.addEventListener('click', function(event) {
                that._dispatcher.dispatchEvent(
                    new GameEvent(GameEvent.CLICK_TO_DEBUG_MENU)
                );
            });*/
            this.img.addEventListener('click', function (event) {
                that._dispatcher.dispatchEvent(
                    new GameEvent(GameEvent.NEW_GAME)
                );
            });
            dispatcher.addEventListener(GameEvent.FLAGS_COUNTER_CHANGED, function(event) {
                that.changeValueFlag();
            });
        },
        addEventRightClick: function(event)
        {
            var that = this,
                target = event.target,
                 x      = +target.dataset.x,
                 y      = +target.dataset.y;

                if (target.tagName !== "TD") {
                    return false;
                }
                that._dispatcher.dispatchEvent(
                    new GameEvent(GameEvent.CLICK_TO_FIELD_RIGHT, {"x": x, "y": y})
                );
        },

        addEventLeftClick: function (event) {
            var that = this,
                target = event.target,
                x = +target.dataset.x,
                y = +target.dataset.y;
               // console.log(event.which);
                if (target.tagName !== "TD") {
                    return false;
                }
                that._dispatcher.dispatchEvent(
                    new GameEvent(GameEvent.CLICK_TO_FIELD_LEFT, {"x": x, "y": y})
                );
        },

        redrawField: function (field) {

            for (var x = 0; x < field.length; x++) {
                if(this.game.isFlag(field[x].x, field[x].y) === true) {
                    this.resign(this.table, '', field[x].x, field[x].y, 'F');
                    return;
                }
                if(field.length === 1){
                    this.resign(this.table, '', field[x].x, field[x].y, ' ');
                    return
                }
                if (this.game.checkMine(field[x].x, field[x].y) === false) {
                    this.resign(this.table, 'empty-cell', field[x].x, field[x].y, 'M');
                }

                else if (this.game.IsNearCell(field[x].x, field[x].y) === true) {

                    switch (field[x].count) {
                        case 1:
                            this.resign(this.table, 'one', field[x].x, field[x].y, field[x].count);
                            this.table.querySelector('td[data-y='+'"'+field[x].y+'"]'+'[data-x='+'"'+field[x].x+'"]').className='one empty-cell';
                            break;
                        case 2:
                            this.resign(this.table, 'two', field[x].x, field[x].y, field[x].count);
                            this.table.querySelector('td[data-y='+'"'+field[x].y+'"]'+'[data-x='+'"'+field[x].x+'"]').className='two empty-cell';
                            break;
                        case 3:
                            this.resign(this.table, 'three', field[x].x, field[x].y, field[x].count);
                            this.table.querySelector('td[data-y='+'"'+field[x].y+'"]'+'[data-x='+'"'+field[x].x+'"]').className='three empty-cell';
                            break;
                        case 4:
                            this.resign(this.table, 'four', field[x].x, field[x].y, field[x].count);
                            this.table.querySelector('td[data-y='+'"'+field[x].y+'"]'+'[data-x='+'"'+field[x].x+'"]').className='four empty-cell';
                            break;
                    }
                }
                else{
                    this.resign(this.table, 'empty-cell', field[x].x, field[x].y);
                }

            }
        },
        gameStatus: function () {
            var Status = this.game.getGameStatus();
            if(Status === Modell.STATUS_WIN){
                return 'You win.Congratulations!!!'
            }
            if(Status ===Modell.STATUS_LOSE)
            {
                this.setFace(DOMView.DEATHFACE);
                return "You lose.Don't worry"
            }
        },
        _preventContextMenuOnField : function() {
            this.table.addEventListener("contextmenu", function(event) {
                event.preventDefault();
            });
        },

        removeGameField: function(){
            this.table.remove();
        },
        setFace: function (FaceType) {
            this.img.src ='image/'+FaceType+'.png';
        },



    }