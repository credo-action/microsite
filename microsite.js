function getQueryVariables() {
    var variables = {};

    var queryString = location.search.substr(1);
    var pairs = queryString.split('&');

    for (var i = 0; i < pairs.length; i++) {
        var keyValue = pairs[i].split('=');
        variables[keyValue[0]] = keyValue[1];
    }
    return variables;
}


function getSource(v) {
    if (v.source) {
        return v.source.trim().toLowerCase();
    } else {
        return null;
    }
}


function commafy(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getAKID(v) {
    if (v.akid) {
        var parts = v.akid.split('.');

        if (parts.length < 2) {
            return null;
        }
        return parts[1];
    } else {
        return null;
    }
}

// Setup shortcuts for AJAX.
var ajax = {
    get: function(url, callback) {
        callback = callback || function() {};

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                callback(xhr.response);
            }
        };
        xhr.open('get', url, true);
        xhr.send();
    },

    post: function(url, formData, callback) {
        callback = callback || function() {};

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                callback(xhr.response);
            }
        };
        xhr.open('post', url, true);
        xhr.send(formData);
    },
};

/* call form submit button handler */
$('.call-form').submit(function (e) {
        e.preventDefault();
        var phoneField = $('#phone').val();
        console.log(phoneField);
        var phone = $('#phone').val().trim().replace(/[^\d]/g, '');
        if (phone.length !== 10) {
            $('#phone').focus();
            return alert('Please enter your 10 digit US phone number.');
        }

        var v = getQueryVariables();
        var akid = getAKID(v);
        var source = getSource(v);

        var campaignId, url;
        campaignId = 'obamas_wars';
        url =
            'https://credo-action-call-tool.herokuapp.com/create' +
            '?campaignId=' + campaignId +
            '&userPhone=' + phone +
            '&ak_id=' + (akid  || null) +
            '&source_id=' + (source || null);

        console.log(url);
        ajax.get(url);

        $('.calling').html('We&apos;re calling you now.');

});