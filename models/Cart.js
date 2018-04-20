module.exports = function Cart(currentCart) {

    if(typeof currentCart.items !== 'undefined') {
        this.items = currentCart.items;
        this.totalItemsQuantity = currentCart.totalItemsQuantity;
        this.totalPrice = currentCart.totalPrice;
    } else {
        this.items = [];
        this.totalItemsQuantity = 0;
        this.totalPrice = 0;
    }


    this.add = function(item) {
        if(item) {
            var foundedProductIndex = -1;
            if(this.items.length > 0) {
                for(var i=0; i<this.items.length;i++) {
                    if(this.items[i].id == item.id) {
                        foundedProductIndex = i;
                    }
                }
                if(foundedProductIndex > -1) {
                    this.items[foundedProductIndex].quantity++;
                } else {
                    this.items.push(item);
                }
            } else {
                this.items.push(item);
            }
            var cartTotalAmounts = this.calculateToalPriceAndQuantity();
            this.totalPrice = parseFloat(cartTotalAmounts.totalSum).toFixed(2);
            this.totalItemsQuantity = cartTotalAmounts.totalQuantity;
        }
        
    }


    this.calculateToalPriceAndQuantity = function() {
        var result = {
            totalSum:0,
            totalQuantity:0
        }
        if(this.items.length > 0) {
            var allCartItems = this.items;
            var allCartItemsCount = allCartItems.length;
            for(var i = 0; i < allCartItemsCount; i++) {
                var priceToBeAdded = allCartItems[i].price;
                priceToBeAdded = parseFloat(priceToBeAdded * allCartItems[i].quantity);
                result.totalQuantity = result.totalQuantity + (1 * allCartItems[i].quantity)
                result.totalSum = result.totalSum+priceToBeAdded;
            }
        }
        return result;
    }
}