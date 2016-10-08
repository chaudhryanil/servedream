$(document).ready(function() {
    console.log('Begin21');
    var event_count = localStorage.getItem('calendar_event_count');
    if(event_count == null)
        event_count = 0;

    var d = new Date();
    var month = d.getMonth() + 1;

    if(parseInt(month) < 10) {
        var temp = '0';
        temp += month;
        month = temp;
    }
    var day_ref = {
        0: 'sun',
        1: 'mon',
        2: 'tue',
        3: 'wed',
        4: 'thu',
        5: 'fri',
        6: 'sat',
    }
    var date = d.getDate();
    var year = d.getFullYear();
    var dateString = year + '-' + month + '-' + date;
    var formatDate = function(now) {
            var tzo = -now.getTimezoneOffset();
            var dif = tzo >= 0 ? '+' : '-';
            var pad = function(num) {
                var norm = Math.abs(Math.floor(num));
                return (norm < 10 ? '0' : '') + norm;
            };
        return now.getFullYear()
            + '-' + pad(now.getMonth()+1)
            + '-' + pad(now.getDate())
            + 'T' + pad(now.getHours())
            + ':' + pad(now.getMinutes())
            + ':' + pad(now.getSeconds())
            + dif + pad(tzo / 60)
            + ':' + pad(tzo % 60);
    };

    //Triggered on each render of the month view, displays the current day in the desired color.
    var markToday = function() {
        list = document.getElementsByClassName('fc-today');
        for(var i = 0 ; i < list.length ; i++) {
            list[i].style.background = '#2ed39e';
            list[i].style.color = '#f8f8f8';
            var day = new Date().getDay();
            day = day_ref[day];
            var class_name = 'fc-' + day;
            var list2 = document.getElementsByClassName(class_name);
            for(var j = 0 ; j < list2.length ; j++) {
                list2[i].style.background = 'rgba(0, 0, 0, 0.15)';
            }
        }
    };

    //Triggered on each click of a day, to display the form for creating an event.
    var dayClickEvent = function(date, jsEvent, view) {
        date = date.format("dddd, D MMMM YYYY");
        date = '<span style="color: #ff8787">' + date + '</span>'
        $(this).webuiPopover({
            title: date,
            type: 'html',
            position: 'right',
            content: $('#modal_add').html(),
            animation: 'fade',
            closeable: true,
            onShow: function() {
                list = document.getElementsByClassName('webui-popover');
                for(var i = 0 ; i < list.length ; i++)
                    list[i].style.borderColor = '#ff8787';
            }
        });
    };

    var eventClickEvent = function(event, jsEvent, view) {
        var modal_content = [
            '<strong><span style="color: #b3b3b3">Where</span></strong>',
            '<br><strong><p id="label_location" style="margin-bottom: 2px; color: #777777">' + event.location + '</p></strong>',
            '<br><strong><span style="color: #b3b3b3">When</span></strong>',
            '<br><strong><p id="label_time" style="margin-bottom: 2px; color: #777777">' + event.start_date + '</p></strong>',
            '<br><strong><span id="label_description" style="color: #b3b3b3">Description</label></strong>',
            '<br><strong><p id="label_description" style="margin-bottom: 2px; color: #777777">' + event.description + '</p></strong>',
            '</div>'];
        console.log(modal_content.join());
        $(this).webuiPopover({
            title: event.title,
            type: 'html',
            position: 'right',
            content: '<strong>EVENT</strong>',
            closeable: true,
            onShow: function() {
                list = document.getElementsByClassName('webui-popover');
                for(var i = 0 ; i < list.length ; i++)
                    list[i].style.borderColor = '#ff8787';
            }
        });
    };

    var event_list = [];
    var xhttp = new XMLHttpRequest();
    // $.get("/get_events", {},
    //     function (data, textStatus, jqXHR) {
    //         console.log(JSON.parse(data));
    //     },
    //     "application/json"
    // );
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 1 && xhttp.status == 200) {
            console.log("Received");
            var events = JSON.parse(xhttp.responseText);
            console.log(events);
            // if(events.length > 0) {
            //     for(var i = 0 ; i < events.length ; i++) {
            //         var event = {
            //             id: events[i].Event_ID,
            //             title: events[i].Name,
            //             start: events[i].Start,
            //             location: events[i].Location,
            //             end: events[i].End,
            //             description: events[i].Description
            //         }
            //         console.log(event);
            //         event_list.push(event);
            //     }
            // }
        }
    };
    xhttp.open('GET', '/get_events', true);
    //xhttp.send(null);

    //Initialize the calendar
    $('#calendar').fullCalendar({
        theme: true,
        header: {
            left: '',
            center: 'next, prev, title',
            right: ''
        },
        defaultDate: dateString,
        editable: true,
        eventLimit: true,
        viewRender: markToday,
        dayClick: dayClickEvent,
        eventClick: eventClickEvent,
        events: event_list
    });

    //Adjusting the height of the left column.
    $('#left-column').css('height', $(document).height() + "px");

    //Creating the clock
    var d = new Date();
    var s = d.toTimeString();
    $('#clock').html(s.slice(0, s.indexOf(':') + 3));

    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            s = JSON.parse(xhttp.responseText);
            var condition = s.current.condition;
            var html = "<p class='time'>" + "<img src='" + "http://" + condition.icon.slice(2) + "'>" + s.current.temp_c + String.fromCharCode(176) + "</p>";
            html += "<p class='time' style='font-size:15px'>" + condition.text + "</p>";
            $('#weather').html(html);
        }
    };
    xhttp.open('GET', "http://api.apixu.com/v1/current.json?key=05fcb9bae03b415baf4145821161708&q=Delhi,IN", true);
    xhttp.send();

    var list = document.getElementsByClassName('fc-other-month');
    for(var i = 0 ; i < list.length ; i++) {
        list[i].style.background = '#f8f8f8';
        list[i].style.color = '#b3b3b3';
    }

    list = document.getElementsByClassName('fc-today');
    for(var i = 0 ; i < list.length ; i++) {
        list[i].style.background = '#2ed39e';
        list[i].style.color = '#f8f8f8';
    }

    $('td').css('text-align', 'left');
    $('td').css('margin-top', '10px');

    //Saving an event

    $(document).on("click", "#save", function() {
        var event_name = $(this).parent().find('#event_name').val();
        var location = $(this).parent().find('#location').val();
        var start_date = $(this).parent().find('#start_date').val();
        var start_time = $(this).parent().find('#start_time').val();
        var end_date = $(this).parent().find('#end_date').val();
        var end_time = $(this).parent().find('#end_time').val();

        start_date = new Date(start_date.slice(0, 4), (parseInt(start_date.slice(5, 7)) - 1).toString(), start_date.slice(8), start_time.slice(0, 2),
                    start_time.slice(3));
        console.log(start_date);
        end_date = new Date(end_date.slice(0, 4), (parseInt(end_date.slice(5, 7)) - 1).toString(), end_date.slice(8), end_time.slice(0, 2),
                    end_time.slice(3));
        console.log(end_date);

        start_date = formatDate(start_date);
        end_date = formatDate(end_date);
        console.log(start_date);
        console.log(end_date);
        var all_day = $(this).parent().find('#all-day').prop('checked');
        var description = $(this).parent().find('#description').val();

        var event = {
            title: event_name,
            allDay: false,
            start: start_date,
            end: end_date,
            description: description,
            location: location,
            id: event_count
        };

        var data = {
                event_name: event_name,
                location: location,
                start_date: start_date,
                end_date: end_date,
                all_day: false,
                description: description,
                id: event_count
            };
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                data = JSON.parse(xhttp.responseText);
                if(data.Status == 'OK') {
                    $('#calendar').fullCalendar('renderEvent', event, true);
                    event_count += 1;
                    localStorage.setItem('calendar_event_count', event_count);
                } else {
                    alert(data.Message);
                }
            }
        };
        xhttp.open('POST', '/create');
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(data));
    });
});
