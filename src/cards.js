import { reactive, computed } from '@vue/runtime-core';
let Cards = reactive({
    name: 'cards',

    winToBalance: {
        topology: 'static',
        time: 2000, /*Время накрутки*/
    },
    time: 0

});

Cards.baseInit = function() {
    console.log('init')
};

export default Cards;