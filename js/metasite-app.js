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
            createTable($('#filter-form'));
        }, 'json');
    });

    $('#filter-form').submit(function(e) {
        e.preventDefault();
        createTable(this);
    });
});

var map = {y: 'Taip',
           n: 'Ne',
           m: 'Gal'};


function createRow(data) {
    res = '';
    res = '<tr><td>' + data.name + '</td>'
    + '<td>' + data.surname + '</td>'
    + '<td>' + data.phone + '</td>'
    + '<td>' + data.age + '</td>'
    + '<td>' + map[data.attending] + '</td>'
    + '<td></td></tr>';
    return res;
}

function filter() {
    createTable($('#filter-form'));
}

function createTable(form) {
    $.get($(form).attr('action'), $(form).serialize(), function(response) {
        var tableBody = $('#atendies').find('tbody');
        $(tableBody).html('');
        $('#paging').html('');
        var len = response.results.length;

        if (len == 0) {
            $(tableBody).append('<tr><td colspan=6 class="text-center">Dalyvių nėra</td></tr>');
        }
        else {
            var row = '';
            for (var i = 0; i < len; i++) {
                $(tableBody).append(createRow(response.results[i]));
            }
            if (response.totalPages > 1) {
                paging = '<span>Puslapiai:</span><input type="hidden" name="page" value="' + response.page + '" id="page-number">';
                for (var i = 0; i < response.totalPages; i++) {
                    page = i + 1;
                    paging += '<a href="javascript:getPage(' + page + ')" data-page=' + page + '>' + page + '</a>';
                }
                $('#paging').html(paging)
                $('#paging a[data-page=' + response.page + ']').addClass('active');
            }
        }
    }, 'json');
}

function getPage(pageNumber) {
    $('#filter-form #page-number').val(pageNumber);
    createTable($('#filter-form'));
}
