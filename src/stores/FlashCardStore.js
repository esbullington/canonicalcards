var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var FlashCardConstants = require('../constants/FlashCardConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _flashcards = {};

/**
 * Create a FLASHCARD item.
 * @param  {string} text The content of the FLASHCARD
 */
function create(text) {
  // Hand waving here -- not showing how this interacts with XHR or persistent
  // server-side storage.
  // Using the current timestamp + random number in place of a real id.
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _flashcards[id] = {
    id: id,
    complete: false,
    text: text
  };
}


var FlashCardStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of FLASHCARDs.
   * @return {object}
   */
  getAll: function() {
    return _flashcards;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register to handle all updates
AppDispatcher.register(function(payload) {
  var action = payload.action;
  var text;

  switch(action.actionType) {
    case FlashCardConstants.FLASHCARD_CREATE:
      text = action.text.trim();
      if (text !== '') {
        create(text);
      }
      break;

    default:
      return true;
  }

  // This often goes in each case that should trigger a UI change. This store
  // needs to trigger a UI change after every view action, so we can make the
  // code less repetitive by putting it here.  We need the default case,
  // however, to make sure this only gets called after one of the cases above.
  FlashCardStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = FlashCardStore;
