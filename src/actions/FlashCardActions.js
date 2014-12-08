var AppDispatcher = require('../dispatcher/AppDispatcher');
var CardConstants = require('../constants/FlashCardConstants');

var FlashCardActions = {

  /**
   * @param  {string} text
   */
  create: function(text) {
    AppDispatcher.handleViewAction({
      actionType: FlashCardConstants.CARD_CREATE,
      text: text
    });
  },


};

module.exports = FlashCardActions;
