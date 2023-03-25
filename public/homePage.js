"use strict";

const logout = new LogoutButton();

logout.action = function () {
    ApiConnector.logout((response) => {
        if(response.success) {
            location.reload();
        }
    })
};

ApiConnector.current((response) => {
    if(response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const currency = new RatesBoard();

function currencyRates (currency) {
    ApiConnector.getStocks((response) => {
        if(response.success) {
            currency.clearTable();
            currency.fillTable(response.data);
        }
    });
}

currencyRates(currency);
setInterval(currencyRates, 60000, currency);

const moneyController = new MoneyManager();

moneyController.addMoneyCallback = function(data) {
    ApiConnector.addMoney(data, (response) => {
        if(response.success) {
            ProfileWidget.showProfile(response.data);
            this.setMessage(true, 'Баланс пополнен успешно');
        } else {
            this.setMessage(false, response.error);
        }
    });
};

moneyController.conversionMoneyCallback = function(data) {
    ApiConnector.convertMoney(data, (response) => {
        if(response.success) {
            ProfileWidget.showProfile(response.data);
            this.setMessage(true, 'Конвертация выполнена успешно');
        } else {
            this.setMessage(false, response.error);
        }
    });
};

moneyController.sendMoneyCallback = function(data) {
    ApiConnector.transferMoney(data, (response) => {
        if(response.success) {
            ProfileWidget.showProfile(response.data);
            this.setMessage(true, 'Перевод выполнен успешно');
        } else {
            this.setMessage(false, response.error);
        }
    });
};

const favorites = new FavoritesWidget();

function updateFavorites(response) {
    favorites.clearTable();
    favorites.fillTable(response.data);
    moneyController.updateUsersList(response.data);
}

ApiConnector.getFavorites((response) => {
    if (response.success) {
        updateFavorites(response);
    }
});

favorites.addUserCallback = function (data) {
    ApiConnector.addUserToFavorites(data, (response) => {
        if (response.success) {
            updateFavorites(response);
            this.setMessage(true, 'Пользователь добавлен в избранное');
        } else {
            this.setMessage(false, response.error);
        }
    });
};

favorites.removeUserCallback = function (data) {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        if (response.success) {
            updateFavorites(response);
            this.setMessage(true, 'Пользователь удален из избранного');
        } else {
            this.setMessage(false, response.error);
        }
    });
};