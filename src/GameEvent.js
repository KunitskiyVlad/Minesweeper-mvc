function GameEvent(type, data) {
    SyntheticEvent.apply(this, arguments);
}

GameEvent.prototype   = Object.create(SyntheticEvent.prototype);
GameEvent.constructor = SyntheticEvent;

GameEvent.SEVERAL_CELLS_CHANGED = "several cells changed";
GameEvent.GAME_STATUS_CHANGED   = "status changed";
GameEvent.TIMER_VALUE_CHANGED   = "timer value changed";
GameEvent.FLAGS_COUNTER_CHANGED = "flags counter changed";
GameEvent.NEW_GAME              = "new game";
GameEvent.GAME_OVER             = "game over";
GameEvent.CLICK_TO_FIELD_LEFT   = "click to field left";
GameEvent.CLICK_TO_FIELD_RIGHT  = "click to field right";
GameEvent.CLICK_TO_DEBUG_MENU   =  "click to debug menu";

