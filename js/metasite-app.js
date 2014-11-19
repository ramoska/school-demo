$(document).ready(function() {
    $('#participation-form').submit(function(e) {
        e.preventDefault();
        var form = this;
        $.post($(this).attr('action'), $(this).serialize(), function(data) {
            var notificationArea = $("#notification-container small");
            $(notificationArea).hide();
            $(notificationArea).attr('class', 'text-' + data.status);
            $(notificationArea).html(data.message);
            $(notificationArea).fadeIn(400).delay(5000).fadeOut(400);
        }, 'json');
    });
});

function filter() {
    var table = $('#atendies');
    var url = $(table).data('url');
    var data = {
        'age-from': $(table).find('input[name=age-from]').val(),
        'age-to': $(table).find('input[name=age-to]').val(),
        'attending': $(table).find('select').val(),
    }
    var tableBody = $(table).find('tbody');
    $.get(url, data, function(response) {
        $(tableBody).html('');
        var len = response.length;
        var map = {
            y: 'Taip',
            n: 'Ne',
            m: 'Gal'
        };

        if (len == 0) {
            $(tableBody).append('<tr><td colspan=6 class="text-center">Dalyvių nėra</td></tr>');
        }
        else {
            var row = '';
            for (var i = 0; i < len; i++) {
                row = '<tr><td>' + response[i].name + '</td>'
                + '<td>' + response[i].surname + '</td>'
                + '<td>' + response[i].phone + '</td>'
                + '<td>' + response[i].age + '</td>'
                + '<td>' + map[response[i].attending] + '</td>'
                + '<td></td></tr>';
                $(tableBody).append(row);
            }
        }
    }, 'json');
}
