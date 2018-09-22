// Storage Controller
const StorageCtrl = (function(){
    return {
        storeItem: function(item){
            const storedData = this.getItems();
            storedData.push(item);
            localStorage.setItem('itemList', JSON.stringify(storedData));
        },

        getItems: function(){
            return localStorage.getItem('itemList') ? JSON.parse(localStorage.getItem('itemList')) : [];
        },

        removeItem: function(itemId){
            const storedData = this.getItems();
            if(storedData.length > 0){
                const ids = storedData.map(item => item.id);
                const index = ids.indexOf(itemId);
                storedData.splice(index,1);
                localStorage.setItem('itemList', JSON.stringify(storedData));
            }
        }
    }
})();


// Item Controller
const ItemCtrl = (function(){
    // Item constructor
    const Item = function(id, name ,calories){
        this.id         = id;
        this.name       = name;
        this.calories   = calories;
    };

    // Data Structure / State
    const data = {
        items: [],
        currentItem: null,
        totalCalories: 0
    };

    return {
        getItems: function(){
            return data.items;
        },

        setAllItems: function(items){
            data.items = items;
        },

        addItem: function(name, calories){
            let ID = (data.items.length > 0) ? data.items[data.items.length-1].id + 1 : 0;
            calories = parseInt(calories);
            // Add to items array
            const item = new Item(ID, name, calories);
            data.items.push(item);
            return item;
        },

        logData: function(){
            return data;
        },

        getTotalCalories: function(){
            let total = 0;
            data.items.forEach(item => {
                total += item.calories;
            });
            data.totalCalories = total;
            return data.totalCalories;
        },

        getItemById: function(id){
            let found = null;
            data.items.forEach(item => {
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },

        updateItem: function(name, calories){
            let found = null;
            data.items.forEach(item => {
                if(item.id === data.currentItem.id){
                    item.name       = name;
                    item.calories   = calories;
                    found           = item;
                }
            });
            return found;
        },

        setCurrentItem: function(item){
            data.currentItem = item;
        },

        getCurrentItem: function(){
            return data.currentItem;
        },

        deleteItem: function(itemId){
            const ids   = data.items.map(item => item.id);
            const index = ids.indexOf(itemId);
            data.items.splice(index, 1);
        },

        clearAllItems: function(){
            data.items = [];
            data.totalCalories = 0;
            data.currentItem = null;
        }
    };
})();

// UI Controller
const UICtrl = (function(){
    const UISelectors = {
        addBtn:             '.add-btn',
        updateBtn:          '.update-btn',
        deleteBtn:          '.delete-btn',
        backBtn:            '.back-btn',
        clearBtn:           '.clear-btn',
        totalCalories:      '.total-calories',
        itemList:           '#item-list',
        itemNameInput:      '#item-name',
        itemCaloriesInput:  '#item-calories',
        listItems:          '#item-list li'
    };

    return {
        populateItemList: function(items){
            let html = '';
            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}">
                            <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil-alt"></i></a>
                        </li>`;
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
        },

        addListItem: function(item){
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            li.classList.add('collection-item');
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil-alt"></i></a>`;
            // Insert li
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },

        clearFields: function(){
            document.querySelector(UISelectors.itemNameInput).value     = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },

        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },

        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },

        clearEditState: function(){
            this.clearFields();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display   = 'none';
            document.querySelector(UISelectors.addBtn).style.display    = 'inline';
        },
        
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display   = 'inline';
            document.querySelector(UISelectors.addBtn).style.display    = 'none';
        },

        addItemToForm: function(currentItem){
            document.querySelector(UISelectors.itemNameInput).value     = currentItem.name;
            document.querySelector(UISelectors.itemCaloriesInput).value = currentItem.calories;
        },

        updateListItem: function(item){
            const listItem = document.querySelector(`#item-${item.id}`);
            if(listItem){
                listItem.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil-alt"></i></a>`;
            }
        },

        deleteListItem: function(id){
            document.querySelector(`#item-${id}`).remove();
        },

        removeItems: function(){
            let listItems = Array.from(document.querySelectorAll(UISelectors.listItems));
            listItems.forEach(li => li.remove());
        }
    };
})();


// App Controller
const App = (function(ItemCtrl, UICtrl, StorageCtrl){
    // Event listeners
    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors();

        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        document.addEventListener('keypress', e => {
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
            }
        });
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState)
    }

    const itemAddSubmit = function(e){
        // Get form input from UI Controller
        const {itemNameInput: itemName, itemCaloriesInput: itemCalories} = UICtrl.getItemInput();
        
        if(itemName !== '' && itemCalories !== '' && parseInt(itemCalories) >= 0){
            const newItem = ItemCtrl.addItem(itemName, itemCalories);
            // Add item to UI List
            UICtrl.addListItem(newItem);
            // Get total calories
            UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
            // Store in LS
            StorageCtrl.storeItem(newItem);
            // Clear input fields
            UICtrl.clearFields();
        }

        e.preventDefault();
    }

    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            const itemId = e.target.parentNode.parentNode.id.split('-')[1];
            const itemToEdit = ItemCtrl.getItemById(parseInt(itemId));
            ItemCtrl.setCurrentItem(itemToEdit);
            UICtrl.addItemToForm(ItemCtrl.getCurrentItem());
            UICtrl.showEditState();
        }
        
        e.preventDefault();
    }
    
    const itemUpdateSubmit = function(e){
        const {itemNameInput: updateName, itemCaloriesInput: updateCalories} = UICtrl.getItemInput();
        const updatedItem = ItemCtrl.updateItem(updateName, parseInt(updateCalories));   

        UICtrl.updateListItem(updatedItem);        
        UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
        UICtrl.clearEditState();
        
        e.preventDefault();
    }

    const itemDeleteSubmit = function(e){
        const currentItem = ItemCtrl.getCurrentItem();

        ItemCtrl.deleteItem(currentItem.id);  
        StorageCtrl.removeItem(currentItem.id);
        UICtrl.deleteListItem(currentItem.id);
        UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
        UICtrl.clearEditState();
        
        e.preventDefault();
    }
    
    const clearAllItemsClick = function(e){
        // Delete all items from data structure
        ItemCtrl.clearAllItems();
        UICtrl.removeItems();
        UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
        UICtrl.clearEditState();
        UICtrl.hideList();

        e.preventDefault();
    }

    return {
        init: function(){
            // Set Initial State
            UICtrl.clearEditState();
            console.log('Initializing app...');

            // Load from LS
            ItemCtrl.setAllItems(StorageCtrl.getItems());

            // Fetch items in list
            const items = ItemCtrl.getItems();
            
            // Check if any items in list
            if(items.length === 0){
                UICtrl.hideList();
            } else{
                // Populate list with items
                UICtrl.populateItemList(items);    
                // Get total calories
                UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
            }

            // Load event listeners
            loadEventListeners();
        }
    };
})(ItemCtrl, UICtrl, StorageCtrl);

App.init();

