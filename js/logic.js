var state = {};
state.isMobile = /mobile/i.test(navigator.userAgent);
state.pageShortName = 'stop_war_with_iran';


var signatureGoals = {
    '450': 500,
    '900': 1000,
    '2400': 2500,
    '4500': 5000,
    '9500': 10000,
    '13000': 15000,
    '22000': 25000,
    '45000': 50000,
    '70000': 75000,
    '90000': 100000,
    '140000': 150000,
    '190000': 200000,
    '240000': 250000,
    '290000': 300000,
    '340000': 350000,
    '390000': 400000,
    '490000': 500000,
};

function generateGoal(current) {
    for (var bar in signatureGoals) {
        if (current < +bar) {
            return signatureGoals[bar];
        }
    }

    return 750000;
}


function commafy(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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


var events = {
    list: {},
    on: function(event, callback) {
        if (!this.list[event]) {
            this.list[event] = [];
        }

        this.list[event].push(callback);
    },
    trigger: function(event, data) {
        if (!this.list[event]) {
            return;
        }

        for (var i = 0; i < this.list[event].length; i++) {
            this.list[event][i](data);
        }
    },
};


var SignatureProgress = React.createClass({displayName: "SignatureProgress",
    componentDidMount: function() {
        window.onActionKitProgress = this.onActionKitProgress;

        var script = document.createElement('script');
        script.src = 'https://act.credoaction.com/progress/' + state.pageShortName + '?callback=onActionKitProgress';
        document.body.appendChild(script);
    },

    getInitialState: function() {
        return {
            current: 0,
            goal: 0,
            percent: -1,
        };
    },

    onActionKitProgress: function(res) {
        var current = res.total.actions;
        var goal = generateGoal(current);
        var percent = Math.floor(100 * current / goal);

        this.setState({
            current: current,
            goal: goal,
            percent: percent,
        });
    },

    render: function(e) {
        if (this.state.percent < 0) {
            return (
                React.createElement("div", {className: "progress"}, 
                    React.createElement("div", {className: "bar"}, 
                        React.createElement("div", {className: "filled"})
                    )
                )
            );
        }

        var css = {
            opacity: 1,
            width: Math.min(this.state.percent, 100) + '%',
        };

        return (
            React.createElement("div", {className: "progress visible"}, 
                React.createElement("div", {className: "bar"}, 
                    React.createElement("div", {className: "filled", style:  css })
                ), 

                React.createElement("div", {className: "percent"}, 
                     this.state.percent, "%"
                ), 

                React.createElement("div", {className: "summary"}, 
                    "We've reached ",  commafy(this.state.current), " of our goal of ",  commafy(this.state.goal), "."
                )
            )
        );
    },
});


var EmailForm = React.createClass({displayName: "EmailForm",
    render: function() {
        return (
            React.createElement("section", {className: "form"}, 

                React.createElement(SignatureProgress, null), 

                React.createElement("form", {onSubmit:  this.onSubmit, method: "POST", action: "http://act.credoaction.com/act/", "accept-charset": "utf-8"}, 
                    React.createElement("h2", null, "Add your name"), 

                    React.createElement("div", {className: "text-fields"}, 
                        React.createElement("input", {placeholder: "First and Last Name", name: "name"}), 
                        React.createElement("input", {placeholder: "Email", name: "email", "data-pattern-name": "email", type: "email"}), 
                        React.createElement("input", {placeholder: "Address", name: "address1"}), 
                        React.createElement("input", {placeholder: "Zip Code", name: "zip", "data-pattern-name": "zip", type: "tel"})
                    ), 

                    React.createElement("div", {className: "hidden"}, 
                        React.createElement("input", {type: "hidden", name: "page", value:  state.pageShortName}), 
                        React.createElement("input", {type: "hidden", name: "want_progress", value: "1"}), 
                        React.createElement("input", {type: "hidden", name: "country", value: "United States"}), 
                        React.createElement("input", {type: "hidden", name: "js", value: "1"}), 
                        React.createElement("input", {type: "hidden", name: "action_user_agent", value:  navigator.userAgent}), 
                        React.createElement("input", {type: "hidden", name: "form_name", value: "act-petition"}), 
                        React.createElement("input", {type: "hidden", name: "url", value:  location.href}), 
                        React.createElement("input", {type: "hidden", name: "opt_in", value: "1"})
                    ), 

                    React.createElement("div", {className: "disclaimer"}, 
                        React.createElement("label", null, 
                            React.createElement("input", {name: "action_optin_iranswap", type: "checkbox"}), 

                            "I consent to being added to the email", 
                            React.createElement("br", null), 
                            "list of one or more participating orgs."
                        )
                    ), 

                    React.createElement("button", null, 
                        "Click to Sign"
                    )
                )

            )
        );
    },

    patterns: {
        zip: /^[0-9]*(-[0-9]+)?$/,
        email: /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}$/i,
    },

    onSubmit: function(e) {
        var inputs = this.getDOMNode().querySelectorAll('input');
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            var value = input.value.trim();

            if (!value) {
                alert('Please enter your ' + input.getAttribute('name') + '.');
                input.focus();
                e.preventDefault();
                return;
            }

            var patternName = input.getAttribute('data-pattern-name');
            if (patternName && this.patterns[patternName]) {
                var pattern = this.patterns[patternName];
                var regex = new RegExp(pattern);

                if (!regex.test(value)) {
                    alert('Please enter a valid ' + input.getAttribute('name') + '.');
                    input.focus();
                    e.preventDefault();
                    return;
                }
            }
        }
    },
});


var App = React.createClass({displayName: "App",
    renderDescription: function() {
        return (
            React.createElement("div", {className: "description"}, 
                React.createElement("h2", null, "Sign the petition: Defend the Iran deal and stop Republicans from starting a war with Iran"), 

                "This is the final showdown to stop Republicans from starting a war with Iran.", 
                React.createElement("div", {className: "spacer"}), 

                "The United States, Iran and five other world powers announced a historic deal to dramatically curb Iran's nuclear program in exchange for easing international sanctions on Iran.", 
                React.createElement("div", {className: "spacer"}), 

                "Republicans are trying to sabotage the deal, put us back on the path to confrontation with Iran and start a war – but they can't do it unless Democrats help them.", 
                React.createElement("div", {className: "spacer"}), 

                "We need to build an impenetrable firewall in Congress to prevent Republicans from passing any legislation to kill the deal and putting us back on the path to confrontation and war. Tell Democrats to go on record in support of the deal.", 
                React.createElement("div", {className: "spacer"}), 

                "We'll send your message to your senators and member of Congress, as well as to House and Senate Democratic leadership."
            )
        );
    },

    render: function() {
        return (
            React.createElement("div", {className: "wrapper"}, 
                React.createElement("header", null, 
                    React.createElement("a", {className: "flag", href: "#petition"}), 

                    React.createElement("h1", null, 
                        "Stop War", 
                        React.createElement("br", null), 
                        "With Iran"
                    ), 

                    React.createElement("div", {className: "social"}, 
                        React.createElement("div", {className: "sp_14462 sp_fb_small facebook"}), 
                        React.createElement("div", {className: "sp_14463 sp_tw_small twitter"}), 
                        React.createElement("div", {className: "sp_14461 sp_em_small email"})
                    )
                ), 

                React.createElement("div", {className: "meat"}, 

                    React.createElement("section", {className: "description-mobile"},  this.renderDescription() ), 

                    React.createElement("div", {id: "petition"}), 

                    React.createElement(EmailForm, null), 

                    React.createElement("section", {className: "description-desktop"},  this.renderDescription() )

                ), 

                React.createElement("div", {className: "logos"}), 

                React.createElement("footer", null, 
                    "All content copyright ©2015 ", React.createElement("a", {href: "http://credoaction.com/", target: "_blank"}, "CREDO"), " and partner orgs."
                )
            )
        );
    },

    componentDidMount: function() {
        var script = document.createElement('script');
        script.src = 'https://c.shpg.org/4/sp.js';
        document.body.appendChild(script);
    },
});


React.render(React.createElement(App, null), document.getElementById('app'));
