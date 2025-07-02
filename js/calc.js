/**
 * Калькулятор
 * @constructor
 */
function RetailBonusCounter() {
}

RetailBonusCounter.prototype = {
    init: function () {
        var _this = this;
        this.form = $('#calculator');
        this.result = $('#result');
        this.input = $('#count-users-input');
        this.resultInfo = $('#result-info');
        this.commentsField = $('[data-sid="SIMPLE_QUESTION_223"]');
        this.cardsNumberField = $('[data-sid="CARDS_NUMBER"]');
        this.rangeSlider = document.getElementById('users-range-slider');
        this.usersCount = $('#count-users')
        this.optionsSelectedMessage = '';
        this.formData = {};
        this.items = {
            base    : {
                name : 'Программа лояльности',
                price: 15000,
                add  : 2000,
                order: 1,
            },
            email   : {
                name : 'Электронная почта',
                price: 1250,
                add  : 300,
                order: 2,
            },
            sms     : {
                name : 'СМС',
                price: 1250,
                add  : 300,
                order: 4,
            },
            viber   : {
                name : 'Viber',
                price: 1250,
                add  : 300,
                order: 5,
            },
            push    : {
                name : 'Мобильные пуши',
                price: 1250,
                add  : 300,
                order: 3,
            },
            app     : {
                name : 'Мобильное приложение',
                price: 30000,
                add  : 500,
                order: 7,
            },
            marketer: {
                name : 'Персональный маркетолог',
                price: 50000,
                add  : 0,
                order: 9,
            },
            telegrambot   : {
                name  : 'Чат-бот в Telegram',
                price : 2500,
                add   : 300,
                order : 6,
            },
            cards   : {
                name  : 'Электронные карты',
                price : 4500,
                add   : 0,
                order : 6,
            },
            cabinet : {
                name : 'Личный кабинет',
                price: 6250,
                add  : 750,
                order: 8,
            },
        }

        this.options = {
            usersMinCount     : 5000,
            usersMaxCount     : 1000000,
            usersAdditionCount: 5000,
        };

        noUiSlider.create(this.rangeSlider, {
            start  : [5000],
            connect: [true, false],
            step   : 1,
            range  : {
                'min': [5000, 5000],
                '20%': [200000, 10000],
                '40%': [500000, 20000],
                'max': [1000000],
            },
        });

        this.rangeSlider.noUiSlider.on('update', function (values) {
            var count = Number(values[0])
            var countFormat = _this.formatPrice(count);
            _this.input.val(count);
            _this.usersCount.html(countFormat);
            _this.calc()
        });

        this.input.on('input', function () {
            _this.calc();
        });

        this.input.on('change', function () {
            _this.checkValue($(this).val());
            _this.calc();
        });

        $('input[type=checkbox]').each(function () {
            $(this).on('change', function () {
                _this.calc();
            })
        });

        var buttons = [$('#btn-f-callback-fixed'), $('.s-bonus .button'), $('.s-services .button')];
        $(buttons).each(function () {
            $(this).on('click', function () {
                _this.setFormFields({})
            })
        })

        $('.s-prices .button').on('click', function () {
            _this.setFormFields(_this.formData)
        })
    },

    checkValue: function (value) {
        if (value < this.options.usersMinCount) {
            this.input.val(this.options.usersMinCount);
        }
        if (value > this.options.usersMaxCount) {
            this.input.val(this.options.usersMaxCount);
        }
    },

    renderResultInfo: function (obj) {
        var res = '';
        this.optionsSelectedMessage = '';

        let sortedKeys = Object.keys(obj).sort(function (a, b) {
            return this.items[a].order - this.items[b].order
        }.bind(this));

        for (let key of sortedKeys) {
            if (obj[key] > 0) {
                var price = this.formatPrice(obj[key]);
                var template = '<div class="s-prices__info-item">\n' +
                    '               <h3 class="subtitle s-prices__info-subtitle">' + this.items[key].name + '</h3>\n' +
                    '               <p class="text">' + price + ' <span class="currency">₽</span>/мес.</p>\n' +
                    '            </div>';
                res += template;

                if (key !== 'base' && key !== 'app') {
                    this.optionsSelectedMessage += this.items[key].name + ': Да\n';
                }
            }
        }

        this.resultInfo.html(res);
    },

    setFormFields: function (data) {
        var optionsMessage = '';
        var comments = '';
        var usersCount = '';

        if (data.hasOwnProperty('total')) {
            for (var key in data.options) {
                optionsMessage += this.items[key].name + ': Да\n';
            }

            comments = 'Данные по калькулятору: \n';
            comments += 'Стоимость: ' + this.formatPrice(data.total) + ' руб./мес.\n';
            comments += 'Выбранные опции: \n';
            comments += optionsMessage;
            usersCount = data.usersCount;
        }

        this.commentsField.val(comments);
        this.cardsNumberField.val(usersCount);
    },

    updateMobilePrices: function (usersCount) {
        const addCount = Math.ceil(usersCount / this.options.usersAdditionCount) - 1;

        for (let key in this.items) {
            if (this.items.hasOwnProperty(key)) {
                const item = this.items[key];
                const price = item.price + item.add * addCount;
                const priceBlock = document.querySelector(`#${key}-price`);
                if (priceBlock) {
                    priceBlock.textContent = this.formatPrice(price) + ' ₽';
                }
            }
        }
    },

    // Расчет
    calc: function () {
        var usersCount = Math.abs(this.input.val());
        var total = 0;

        if (usersCount < this.options.usersMinCount) {
            usersCount = this.options.usersMinCount;
        }

        if (usersCount > this.options.usersMaxCount) {
            this.input.val(this.options.usersMaxCount);
            usersCount = this.options.usersMaxCount;
        }

        var addCount = Math.ceil(usersCount / this.options.usersAdditionCount) - 1;

        var sum = {base: this.items.base.price + this.items.base.add * addCount};

        var _self = this;
        $('.s-prices input[type=checkbox]').each(function () {
            if ($(this).is(':checked')) {
                var type = $(this).attr('data-type');
                sum[type] = _self.items[type].price + _self.items[type].add * addCount;
            }
        })


        for (var key in sum) {
            total += sum[key];
        }

        this.renderResultInfo(sum);
        this.updateMobilePrices(usersCount);
        this.result.html(this.formatPrice(total) + ' ₽/мес.');

        this.formData = {
            total     : total,
            usersCount: usersCount,
            options   : sum,
        }
    },


    // Формат цены
    formatPrice: function (price) {
        var floor = Math.floor(price);
        return floor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
};

/**
 * Вызов калькулятора
 */
$(function () {
    var counter = new RetailBonusCounter();
    counter.init();
});