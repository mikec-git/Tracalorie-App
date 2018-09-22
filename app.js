// Storage Controller

// Item Controller
const ItemCtrl = (function(){
    // Item constructor
    const Item = function(id, name ,calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    };

    // Data Structure / State
    const data = {
        items: [
            {id: 0, name: 'Steak Dinner', calories: 1200},
            {id: 1, name: 'Cookie', calories: 400},
            {id: 2, name: 'Eggs', calories: 300}
        ],
        currentItem: null,
        totalCalories: 0
    };

    return {
        getItems: function(){
            return data.items;
        },
        logData: function(){
            return data;
        }
    };
})();


// UI Controller
const UICtrl = (function(){    

    return {
        populateItemList: function(items){
            let html = '';
            items.forEach(item => {
                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil-alt"></i></a>
                </li>
                `;
            });
            document.querySelector('#item-list').innerHTML = html;
        }
    };
})();


// App Controller
const App = (function(ItemCtrl, UICtrl){    
    
    return {
        init: function(){
            console.log('Initializing app...');
            const items = ItemCtrl.getItems();
            UICtrl.populateItemList(items);
        }
    };
})(ItemCtrl, UICtrl);

App.init();