;(function($, QUnit, undefined) {
    QUnit.test('Requirements', function (assert) {
        assert.expect(2);

        assert.ok($, 'jQuery loaded correctly');
        assert.ok(gtmStorage, 'gtmStorage loaded correctly');
    });

    QUnit.test('Single Events', function (assert) {
        var $btn1 = $('#btn1-nodata'),
            $btn2 = $('#btn2-wrongjsondata'),
            $btn3 = $('#btn3-jsondata');

        var action = function ($elem, event) {
            var result;

            localStorage.removeItem(gtmStorage.namespace);
            $elem.trigger(event);

            gtmStorage.getItems().forEach(function (item) {
                var data2send = $(item.element).data(gtmStorage.namespace);

                result = {
                    typeofData2send: typeof data2send,
                    event: typeof data2send === 'object' ? data2send.event : null,
                    data: typeof data2send === 'object' ? data2send.data : null,
                };
            });

            return result;
        };

        assert.expect(3);

        assert.propEqual(action($btn1, 'click'), {
            typeofData2send: 'undefined',
            event: null,
            data: null,
        }, 'No data');

        assert.propEqual(action($btn2, 'click'), {
            typeofData2send: 'string',
            event: null,
            data: null,
        }, 'Incorrect JSON data');

        assert.deepEqual(action($btn3, 'click'), {
            typeofData2send: 'object',
            event: 'linkClick',
            data: {
                element: 'anchor',
                order: 1
            },
        }, 'Correct JSON data');
    });

    QUnit.test('Check storage', function (assert) {
        var $btn1 = $('#btn1-nodata'),
            $btn2 = $('#btn2-wrongjsondata'),
            $btn3 = $('#btn3-jsondata'),
            $btn4 = $('#btn4-jsondata'),
            $btn5 = $('#btn5-jsondata'),
            $btn6 = $('#btn6-jsondata.gtm-click'),
            callback;

        localStorage.removeItem(gtmStorage.namespace);

        $btn1.trigger('click');
        $btn2.trigger('click');
        $btn3.trigger('click');
        $btn4.trigger('click');
        $btn5.trigger('click');
        $btn6.trigger('click');

        assert.expect(2);

        assert.equal(gtmStorage.getItems().length, 6, 'Pushed all events');

        callback = assert.async();
        setTimeout(function () {
            assert.equal(gtmStorage.getItems().length, 4, 'Removed wrong storage items');
            callback();
        }, 2000);
    });

})(jQuery, QUnit);
