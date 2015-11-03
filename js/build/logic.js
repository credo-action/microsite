// Check for outdated browsers.
(function() {
    var isIE = /MSIE (\d+)\./.test(navigator.userAgent);
    if (isIE) {
        var version = +isIE[1];
        if (version < 10) {
            alert('Unfortunately your browser, Internet Explorer ' + version + ', is not supported. Please visit the site with a modern browser like Firefox or Chrome. Thanks!');
        }
    } else if (/Android 2\.3/.test(navigator.userAgent)) {
        alert('Unfortunately your browser, Android 2.3, is not supported. Please visit the site with a modern browser like Firefox or Chrome. Thanks!');
    } else if (typeof React === 'undefined') {
        alert('Unfortunately your browser is not supported. Please visit the site with a modern browser like Firefox or Chrome. Thanks!');
    }
})();



var state = {};
state.isMobile = /mobile/i.test(navigator.userAgent);
state.pageShortName = 'obamas_wars';
state.query = getQueryVariables();



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


function getSource() {
    if (state.query.source) {
        return state.query.source.trim().toLowerCase();
    } else {
        return null;
    }
}


function commafy(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getAKID() {
    if (state.query.akid) {
        var parts = state.query.akid.split('.');

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


var SignatureCount = React.createClass({displayName: "SignatureCount",
    componentDidMount: function() {
        window.onActionKitCount = this.onActionKitCount;

        var script = document.createElement('script');
        script.src = 'https://act.credoaction.com/progress/' + state.pageShortName + '?callback=onActionKitCount';
        document.body.appendChild(script);
    },

    getInitialState: function() {
        return {
            current: -1,
        };
    },

    onActionKitCount: function(res) {
        var current = res.total.actions;

        this.setState({
            current: current,
        });
    },

    render: function(e) {
        if (this.state.current < 0) {
            return (
                React.createElement("div", {className: "count"})
            );
        }
        return (
            React.createElement("div", {className: "count visible"}, 
                React.createElement("div", null,  commafy(this.state.current) ), 
                React.createElement("div", {className: "smaller"}, "signatures")
            )
        );
    },
});


var EmailDisclaimer = React.createClass({displayName: "EmailDisclaimer",
    hiddenFor: [
        'moveon',
    ],

    render: function() {
        var source = getSource();

        if (this.hiddenFor.indexOf(source) > -1) {
            return null;
        }

        return (
            React.createElement("div", {className: "disclaimer"}, 
                React.createElement("label", null, 
                    "You'll receive periodic updates on offers", React.createElement("br", null), "and activism opportunities."
                )
            )
        );
    },
});


var EmailForm = React.createClass({displayName: "EmailForm",
    render: function() {
        var source, sourceField;
        source = getSource();
        if (source) {
            sourceField = (React.createElement("input", {type: "hidden", name: "source", value:  getSource() }));
        }

        return (
            React.createElement("section", {className: "form"}, 

                React.createElement(SignatureCount, null), 

                React.createElement("form", {onSubmit:  this.onSubmit, method: "POST", action: "https://act.credoaction.com/act/", "accept-charset": "utf-8"}, 
                    React.createElement("h2", null, "Add your name"), 

                    React.createElement("div", {className: "text-fields"}, 
                        React.createElement("input", {placeholder: "First and Last Name", name: "name"}), 
                        React.createElement("input", {placeholder: "Email", name: "email", "data-pattern-name": "email", type: "email"}), 
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
                         sourceField 
                    ), 

                    React.createElement("button", null, 
                        "Click to Sign"
                    ), 

                    React.createElement(EmailDisclaimer, null)

                )

            )
        );
    },

    patterns: {
        zip: /^[0-9]*(-[0-9]+)?$/,
        email: /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}$/i,
    },

    onSubmit: function(e) {
        var values = {};
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

            values[input.name] = value;
        }

        try {
            sessionStorage.homeFormValues = JSON.stringify(values);
        } catch (e) {
            // Cookies disabled
        }
    },
});


var Header = React.createClass({displayName: "Header",
    render: function() {
        return (
            React.createElement("header", null, 
                React.createElement("a", {className: "flag", href: "/#petition"}), 
                React.createElement("div", {className: "social"}, 
                    React.createElement("div", {className: "sp_15355 sp_fb_small facebook"}), 
                    React.createElement("div", {className: "sp_15356 sp_tw_small twitter"}), 
                    React.createElement("div", {className: "sp_15354 sp_em_small email"})
                )
            )
        );
    },
});


var Footer = React.createClass({displayName: "Footer",
    render: function() {
        return (
            React.createElement("footer", null, 
                "Contact ", React.createElement("a", {href: "mailto:press@credoaction.com"}, "press@credoaction.com"), " for press inquries.", React.createElement("br", null), 
                "©2015 ", React.createElement("a", {href: "http://credoaction.com/", target: "_blank"}, "CREDO"), ". ", React.createElement("a", {href: "/terms/"}, "Terms of Use.")
            )
        );
    },
});


var Logos = React.createClass({displayName: "Logos",
    render: function() {
        return (
            React.createElement("div", {className: "logos"}, 
                React.createElement("div", {className: "constrainer"}, 
                    React.createElement("a", {target: "_blank", href: "http://credoaction.com/"}, 
                        React.createElement("img", {src: "/images/logos/credo.png"})
                    )
                )
            )
        );
    },
});


var HomePage = React.createClass({displayName: "HomePage",
    renderDescription: function() {
        return (
            React.createElement("div", {className: "description"}, 
                React.createElement("h2", null, "President Obama's Broken Promises and Endless Wars"), 

                React.createElement("h3", null, "Sign the petition to President Obama: Climate leaders don’t drill the Arctic."), 

                React.createElement("center", null, 
                React.createElement("iframe", {width: "560", height: "315", src: "https://www.youtube.com/embed/Ipx2wypPXJw?rel=0", frameborder: "0", allowfullscreen: true})
                ), 
                React.createElement("div", {className: "spacer"}), 

                "President Obama is heading on a trip to Alaska to talk about climate change. There is no clearer symbol of the self-defeating hypocrisy of his policies on energy and climate.", 
                React.createElement("div", {className: "spacer"}), 

                "In Alaska, President Obama’s words about the urgency of climate change, against the backdrop of the Shell oil rig he approved to drill, brings to mind the tragic irony of President George W. Bush declaring “Mission Accomplished” six weeks into his decade-long invasion of Iraq.", 
                React.createElement("div", {className: "spacer"}), 

                "Science is clear: 80% of fossil fuel reserves, ", React.createElement("strong", null, "and 100% of Arctic oil"), ", must stay in the ground to keep us off a global warming collision course. ", React.createElement("strong", null, "That means real climate leaders don’t drill the Arctic."), 
                React.createElement("div", {className: "spacer"}), 

                "But under the president’s “All of the Above” energy policy, the president has approved massive extraction of coal, oil and fracked gas – now including drilling in the Arctic.", 
                React.createElement("div", {className: "spacer"}), 

                React.createElement("strong", null, "President Obama can’t be a climate leader unless he makes a major shift to recognize that he must start keeping carbon in the ground."), " Please send him a message as he heads to Alaska.", 
                React.createElement("div", {className: "spacer"}), 

                "The petition reads:", 

                React.createElement("div", {className: "petition-text"}, 
                    "Climate Leaders Don’t Drill the Arctic. Talking about the urgency of climate change while allowing massive fossil fuel extraction isn’t leadership, it’s hypocrisy. Science says we must not burn 80% of known fossil fuel reserves, including all Arctic oil. President Obama, to lead on climate, you must Keep It In The Ground."
                )
            )
        );
    },

    render: function() {
        return (
            React.createElement("div", {className: "wrapper home-page"}, 
                React.createElement(Header, null), 

                React.createElement("div", {className: "meat"}, 

                    React.createElement("section", {className: "description-mobile"},  this.renderDescription() ), 

                    React.createElement("div", {id: "petition"}), 

                    React.createElement(EmailForm, null), 

                    React.createElement("section", {className: "description-desktop"},  this.renderDescription() )

                ), 

                React.createElement(Footer, null)
            )
        );
    },

    componentDidMount: function() {
        var script = document.createElement('script');
        script.src = 'https://c.shpg.org/4/sp.js';
        document.body.appendChild(script);
    },
});


var CallForm = React.createClass({displayName: "CallForm",
    renderForm: function() {
        if (this.state.isCalling) {
            return (
                React.createElement("div", {className: "calling"}, 
                    "We're calling you now."
                )
            );
        } else {
            return (
                React.createElement("div", null, 
                    React.createElement("h2", null, 
                        "Make a Call"
                    ), 

                    React.createElement("input", {type: "tel", name: "phone", placeholder: "Your phone number", ref: "phone"}), 

                    React.createElement("button", null, 
                        "Click to Connect"
                    ), 

                    React.createElement("div", {className: "sidenote"}, 
                        "Or call ", React.createElement("a", {href:  "tel:" + this.getPhoneNumber('dashed')},  this.getPhoneNumber('pretty') ), " to connect."
                    )
                )
            );
        }
    },

    renderCount: function() {
        if (this.props.callCount > -1) {
            return (
                React.createElement("div", {className: "animation-fade-in"}, 
                    React.createElement("div", {className: "headline"},  commafy(this.props.callCount), " Call", this.props.callCount !== 1 ? 's' : ''), 
                    React.createElement("div", {className: "label"}, "completed")
                )
            );
        } else {
            return;
        }
    },

    getPhoneNumber: function(style) {
        var number = this.props.callNumber || '415-200-1223';
        if (style === 'dashed') {
            return number;
        } else if (style === 'pretty') {
            return '(' + number.replace(/-/, ') ');
        }
    },

    onSubmit: function(e) {
        e.preventDefault();

        var phoneField = this.refs.phone.getDOMNode();
        var phone = phoneField.value.trim().replace(/[^\d]/g, '');
        if (phone.length !== 10) {
            phoneField.focus();
            return alert('Please enter your 10 digit US phone number.');
        }

        var campaignId, url;
        campaignId = 'obamas_wars';
        url =
            'https://credo-action-call-tool.herokuapp.com/create' +
            '?campaignId=' + campaignId +
            '&userPhone=' + phone +
            '&ak_id=' + (this.props.akid  || null) +
            '&source_id=' + (this.props.source || null);

        console.log(url);
        ajax.get(url);

        this.setState({
            isCalling: true,
        });
    },

    getInitialState: function() {
        return {
            isCalling: false,
        };
    },

    render: function() {
        return (
            React.createElement("form", {className: "call-form", onSubmit:  this.onSubmit}, 
                React.createElement("div", {className: "count"}, 
                     this.renderCount() 
                ), 

                React.createElement("div", {className: "background"}, 
                     this.renderForm() 
                )
            )
        );
    },
});


var CallPage = React.createClass({displayName: "CallPage",
    render: function() {
        var css = {
            opacity: this.state.visible ? 1 : 0,
        };

        return (
            React.createElement("div", {className: "wrapper call-page"}, 
                React.createElement(Header, null), 

                React.createElement("div", {className: "meat", style:  css }, 

                     this.getTitle(), 

                    React.createElement("div", {id: "call-form"}), 

                    React.createElement(CallForm, {
                        callCount:  this.state.callCount, 
                        progressivesCount:  this.state.progressivesCount, 
                        source:  this.state.source, 
                        akid:  this.state.akid, 
                        zip:  this.state.zip}
                    ), 

                    React.createElement("div", {className: "description description-call"}, 
                        React.createElement("h3", null, 
                            "Call script"
                        ), 

                        "Hello, my name is ",  this.state.name || '__________', " and I'm calling from ",  this.state.city || '__________', "." + ' ' + 
                        "I’m calling to say that climate leaders don’t drill the Arctic." + ' ' + 
                        "It is hypocritical to talk about the urgency of climate change while allowing massive fossil fuel extraction." + ' ' + 
                        "Science tells us we have to ", React.createElement("strong", null, "leave 80% of known fossil fuel reserves ", React.createElement("em", null, "in the ground")), " to stop the worst effects of climate change –  including ", React.createElement("strong", null, "all Arctic oil"), "." + ' ' + 
                        "If President Obama and his administration want to fight climate change, it’s time to ", React.createElement("u", null, "Keep It In The Ground"), "." + ' ' +
                        "Thank You.", 

                        React.createElement("div", {className: "spacer"}), 

                        React.createElement("h3", null, 
                            "After you call, please share this campaign."
                        ), 

                        React.createElement("center", null, 
                            React.createElement("div", {className: "sp_15355 sp_fb_small"}), 
                            React.createElement("div", {className: "sp_15356 sp_tw_small"}), 
                            React.createElement("div", {className: "sp_15354 sp_em_small"})
                        )
                        
                    )
                ), 

                React.createElement(Logos, null), 

                React.createElement(Footer, null)
            )
        );
    },

    getTitle: function() {        
        return (
            React.createElement("h2", {className: "thanks"}, 
                "Thanks for signing!  Now please call President Obama to deliver your message directly." + ' ' + 
                "The White House counts each call, so this is a really important way to make your voice heard." 
            )
        );
    },

    onSunlightResponse: function(res) {
        var progressivesCount = 0;
        var legislators = JSON.parse(res).results;
        for (var i = 0; i < legislators.length; i++) {
            var legislator = legislators[i];
            if (legislator.party !== 'R') {
                progressivesCount++;
            }
        }

        this.setState({
            progressivesCount: progressivesCount,
            visible: true,
        });
    },

    onCountResponse: function(res) {
        var count = JSON.parse(res).count;

        this.setState({
            callCount: count,
        });
    },

    getInitialState: function() {
        return {
            callCount: -1,
            city: null,
            name: null,
            progressivesCount: 0,
            akid: getAKID(),
            source: getSource(),
            visible: false,
        };
    },

    componentDidMount: function() {
        var script = document.createElement('script');
        script.src = 'https://c.shpg.org/4/sp.js';
        document.body.appendChild(script);

        var values;
        try {
            values = JSON.parse(sessionStorage.homeFormValues);
        } catch (e) {
            // Let's go with the default.
        }

        if (values) {
            var url = 'https://congress.api.sunlightfoundation.com/legislators/locate?apikey=3779f52f552743d999b2c5fe1cda70b6&zip=' + values.zip;
            ajax.get(url, this.onSunlightResponse);

            this.setState({
                name: values.name,
                source: values.source,
                zip: values.zip,
            });
        } else {
            this.setState({
                visible: true,
            });
        }

        // Get call count.
        ajax.get('https://credo-action-call-tool-meta.herokuapp.com/api/count/obamas_wars', this.onCountResponse);
    },
});

var TermsOfService = React.createClass({displayName: "TermsOfService",
    render: function() {
        return (
            React.createElement("div", {className: "wrapper terms-page"}, 
                React.createElement(Header, null), 

                React.createElement("div", {className: "meat"}, 

                    React.createElement("h2", null, 
                        "Website Terms of Use"
                    ), 

                    React.createElement("ul", null, 
                        React.createElement("li", null, 
                            React.createElement("strong", null, "Acceptance of Terms"), React.createElement("br", null), 
                            "This website (“Site”) is provided to you subject to the following Terms of Use (“Terms”). By visiting this site, you accept these Terms."
                        ), 

                        React.createElement("li", null, 
                            React.createElement("strong", null, "Information Collection"), React.createElement("br", null), 
                            "The Site will only collect the personal information you choose to provide. Information about the internet domain and IP address from which you access the Site, the type of browser and operating system used, the date and time of your Site visit, and the Site pages you visit may be collected automatically; this information will not be used to identify you personally."
                        ), 

                        React.createElement("li", null, 
                            React.createElement("strong", null, "Information Sharing and Use"), React.createElement("br", null), 
                            "The name, email address, address, and zip code you enter on the Site will be shared with the participating organizations named on the Site. The participating organizations named on the Site may be updated at any time, including after you enter your information. Your email address and/or Site registration information may be used to offer you special commercial or other benefits and communicate with you in the future. Participating organizations may use the information you provide subject to each participating organization’s own privacy policies."
                        ), 

                        React.createElement("li", null, 
                            React.createElement("strong", null, "Permission to Call"), React.createElement("br", null), 
                            "By entering your phone number on the Site, you give express permission to call that phone number for the purpose of connecting you with legislators."
                        ), 

                        React.createElement("li", null, 
                            React.createElement("strong", null, "Website Use"), React.createElement("br", null), 
                            "You understand and agree that the Web Site is provided \"AS-IS\" and no guarantees are made for the performance of or your use of the site."
                        )

                    ), 

                    React.createElement("div", {className: "effective-date"}, 
                        "Effective Date: July 6, 2015"
                    )

                ), 

                React.createElement(Logos, null), 

                React.createElement(Footer, null)
            )
        );
    },

    componentDidMount: function() {
        var script = document.createElement('script');
        script.src = 'https://c.shpg.org/4/sp.js';
        document.body.appendChild(script);
    },
});


(function() {
    if (/^\/terms\/?/.test(location.pathname)) {
        React.render(React.createElement(TermsOfService, null), document.getElementById('app'));
//    } else if (/^\/call\/?/.test(location.pathname)) {   // matches only to '/call/' pathname
    } else if (/\/call\/?/.test(location.pathname)) {
        React.render(React.createElement(CallPage, null), document.getElementById('app'));
    } else {
        React.render(React.createElement(HomePage, null), document.getElementById('app'));
    }
})();
