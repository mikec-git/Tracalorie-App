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

        addItem: function(name, calories){
            console.log(name, calories);
        },

        logData: function(){
            return data;
        }
    };
})();


// UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories'
    };

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
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        
        getSelectors: function(){
            return UISelectors;
        },

        getItemInput: function(){
            return { 
                itemNameInput: document.querySelector(UISelectors.itemNameInput).value,
                itemCaloriesInput: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        }
    };
})();


// App Controller
const App = (function(ItemCtrl, UICtrl){
    // Event listeners
    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors();

        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    }

    itemAddSubmit = function(e){
        // Get form input from UI Controller
        const {itemNameInput, itemCaloriesInput} = UICtrl.getItemInput();
        
        if(itemNameInput !== '' && itemCaloriesInput !== ''){
            const newItem = ItemCtrl.addItem(itemNameInput, itemCaloriesInput);
        }

        e.preventDefault();
    }
    
    return {
        init: function(){
            console.log('Initializing app...');
            const items = ItemCtrl.getItems();
            UICtrl.populateItemList(items);
            loadEventListeners();
        }
    };
})(ItemCtrl, UICtrl);

App.init();

