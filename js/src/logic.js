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
state.pageShortName = 'obama_keep_it_in_the_ground';
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


var SignatureProgress = React.createClass({
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
                <div className="progress">
                    <div className="bar">
                        <div className="filled" />
                    </div>
                </div>
            );
        }

        var css = {
            opacity: 1,
            width: Math.min(this.state.percent, 100) + '%',
        };

        return (
            <div className="progress visible">
                <div className="bar">
                    <div className="filled" style={ css } />
                </div>

                <div className="percent">
                    { this.state.percent }%
                </div>

                <div className="summary">
                    We&apos;ve reached { commafy(this.state.current) } of our goal of { commafy(this.state.goal) }.
                </div>
            </div>
        );
    },
});


var SignatureCount = React.createClass({
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
                <div className="count" />
            );
        }
        return (
            <div className="count visible">
                <div>{ commafy(this.state.current) }</div>
                <div className="smaller">signatures</div>
            </div>
        );
    },
});


var EmailDisclaimer = React.createClass({
    hiddenFor: [
        'moveon',
    ],

    render: function() {
        var source = getSource();

        if (this.hiddenFor.indexOf(source) > -1) {
            return null;
        }

        return (
            <div className="disclaimer">
                <label>
                    You&#39;ll receive periodic updates on offers<br/>and activism opportunities.
                </label>
            </div>
        );
    },
});


var EmailForm = React.createClass({
    render: function() {
        var source, sourceField;
        source = getSource();
        if (source) {
            sourceField = (<input type="hidden" name="source" value={ getSource() } />);
        }

        return (
            <section className="form">

                <SignatureCount />

                <form onSubmit={ this.onSubmit } method="POST" action="https://act.credoaction.com/act/" accept-charset="utf-8">
                    <h2>Add your name</h2>

                    <div className="text-fields">
                        <input placeholder="First and Last Name" name="name" />
                        <input placeholder="Email" name="email" data-pattern-name="email" type="email" />
                        <input placeholder="Zip Code" name="zip" data-pattern-name="zip" type="tel" />
                    </div>

                    <div className="hidden">
                        <input type="hidden" name="page" value={ state.pageShortName } />
                        <input type="hidden" name="want_progress" value="1" />
                        <input type="hidden" name="country" value="United States" />
                        <input type="hidden" name="js" value="1" />
                        <input type="hidden" name="action_user_agent" value={ navigator.userAgent } />
                        <input type="hidden" name="form_name" value="act-petition" />
                        <input type="hidden" name="url" value={ location.href } />
                        { sourceField }
                    </div>

                    <button>
                        Click to Sign
                    </button>

                    <EmailDisclaimer />

                </form>

            </section>
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


var Header = React.createClass({
    render: function() {
        return (
            <header>
                <a className="flag" href="/#petition"></a>
                <div className="social">
                    <div className='sp_15355 sp_fb_small facebook'></div>
                    <div className='sp_15356 sp_tw_small twitter'></div>
                    <div className='sp_15354 sp_em_small email'></div>
                </div>
            </header>
        );
    },
});


var Footer = React.createClass({
    render: function() {
        return (
            <footer>
                &copy;2015 <a href="http://credoaction.com/" target="_blank">CREDO</a>. <a href="/terms/">Terms of Use.</a>
            </footer>
        );
    },
});


var Logos = React.createClass({
    render: function() {
        return (
            <div className="logos">
                <div className="constrainer">
                    <a target="_blank" href="http://credoaction.com/">
                        <img src="/images/logos/credo.png" />
                    </a>
                </div>
            </div>
        );
    },
});


var HomePage = React.createClass({
    renderDescription: function() {
        return (
            <div className="description">
                <h2>President Obama's 'Mission Accomplished' Moment</h2>

                <h3>Sign the petition to President Obama: Climate leaders don’t drill the Arctic.</h3>

                <center>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/Ipx2wypPXJw?rel=0" frameborder="0" allowfullscreen></iframe>
                </center>
                <div className="spacer" />

                President Obama is heading on a trip to Alaska to talk about climate change. There is no clearer symbol of the self-defeating hypocrisy of his policies on energy and climate.
                <div className="spacer" />

                In Alaska, President Obama’s words about the urgency of climate change, against the backdrop of the Shell oil rig he approved to drill, brings to mind the tragic irony of President George W. Bush declaring “Mission Accomplished” six weeks into his decade-long invasion of Iraq.
                <div className="spacer" />

                Science is clear: 80% of fossil fuel reserves, <strong>and 100% of Arctic oil</strong>, must stay in the ground to keep us off a global warming collision course. <strong>That means real climate leaders don’t drill the Arctic.</strong>
                <div className="spacer" />

                But under the president’s “All of the Above” energy policy, the president has approved massive extraction of coal, oil and fracked gas – now including drilling in the Arctic.
                <div className="spacer" />

                <strong>President Obama can’t be a climate leader unless he makes a major shift to recognize that he must start keeping carbon in the ground.</strong> Please send him a message as he heads to Alaska.
                <div className="spacer" />

                The petition reads:

                <div className="petition-text">
                    Climate Leaders Don’t Drill the Arctic. Talking about the urgency of climate change while allowing massive fossil fuel extraction isn’t leadership, it’s hypocrisy. Science says we must not burn 80% of known fossil fuel reserves, including all Arctic oil. President Obama, to lead on climate, you must Keep It In The Ground.
                </div>
            </div>
        );
    },

    render: function() {
        return (
            <div className="wrapper home-page">
                <Header />

                <div className="meat">

                    <section className="description-mobile">{ this.renderDescription() }</section>

                    <div id="petition" />

                    <EmailForm />

                    <section className="description-desktop">{ this.renderDescription() }</section>

                </div>

                <Logos />

                <Footer />
            </div>
        );
    },

    componentDidMount: function() {
        var script = document.createElement('script');
        script.src = 'https://c.shpg.org/4/sp.js';
        document.body.appendChild(script);
    },
});


var CallForm = React.createClass({
    renderForm: function() {
        if (this.state.isCalling) {
            return (
                <div className="calling">
                    We&apos;re calling you now.
                </div>
            );
        } else {
            return (
                <div>
                    <h2>
                        Make a Call
                    </h2>

                    <input type="tel" name="phone" placeholder="Your phone number" ref="phone" />

                    <button>
                        Click to Connect
                    </button>

                    <div className="sidenote">
                        Or call <a href={ "tel:" + this.getPhoneNumber('dashed') }>{ this.getPhoneNumber('pretty') }</a> to connect.
                    </div>
                </div>
            );
        }
    },

    renderCount: function() {
        if (this.props.callCount > -1) {
            return (
                <div className="animation-fade-in">
                    <div className="headline">{ commafy(this.props.callCount) } Call{this.props.callCount !== 1 ? 's' : ''}</div>
                    <div className="label">completed</div>
                </div>
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
        campaignId = 'obama_keep_it_in_the_ground';
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
            <form className="call-form" onSubmit={ this.onSubmit }>
                <div className="count">
                    { this.renderCount() }
                </div>

                <div className="background">
                    { this.renderForm() }
                </div>
            </form>
        );
    },
});


var CallPage = React.createClass({
    render: function() {
        var css = {
            opacity: this.state.visible ? 1 : 0,
        };

        return (
            <div className="wrapper call-page">
                <Header />

                <div className="meat" style={ css }>

                    { this.getTitle() }

                    <div id="call-form" />

                    <CallForm
                        callCount={ this.state.callCount }
                        progressivesCount={ this.state.progressivesCount }
                        source={ this.state.source }
                        akid={ this.state.akid }
                        zip={ this.state.zip }
                    />

                    <div className="description description-call">
                        <h3>
                            Call script
                        </h3>

                        Hello, my name is { this.state.name || '__________' } and I&apos;m calling from { this.state.city || '__________' }. 
                        I’m calling to say that climate leaders don’t drill the Arctic. 
                        It is hypocritical to talk about the urgency of climate change while allowing massive fossil fuel extraction. 
                        Science tells us we have to <strong>leave 80% of known fossil fuel reserves <em>in the ground</em></strong> to stop the worst effects of climate change –  including <strong>all Arctic oil</strong>. 
                        If President Obama and his administration want to fight climate change, it’s time to <u>Keep It In The Ground</u>.
                        Thank You.

                        <div className="spacer" />

                        <h3>
                            After you call, please share this campaign.
                        </h3>

                        <center>
                            <div className='sp_15355 sp_fb_small' ></div>
                            <div className='sp_15356 sp_tw_small' ></div>
                            <div className='sp_15354 sp_em_small' ></div>
                        </center>
                        
                    </div>
                </div>

                <Logos />

                <Footer />
            </div>
        );
    },

    getTitle: function() {        
        return (
            <h2 className="thanks">
                Thanks for signing!  Now please call President Obama to deliver your message directly. 
                The White House counts each call, so this is a really important way to make your voice heard. 
            </h2>
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
        ajax.get('https://credo-action-call-tool-meta.herokuapp.com/api/count/obama_keep_it_in_the_ground', this.onCountResponse);
    },
});

var TermsOfService = React.createClass({
    render: function() {
        return (
            <div className="wrapper terms-page">
                <Header />

                <div className="meat">

                    <h2>
                        Website Terms of Use
                    </h2>

                    <ul>
                        <li>
                            <strong>Acceptance of Terms</strong><br />
                            This website (“Site”) is provided to you subject to the following Terms of Use (“Terms”). By visiting this site, you accept these Terms.
                        </li>

                        <li>
                            <strong>Information Collection</strong><br />
                            The Site will only collect the personal information you choose to provide. Information about the internet domain and IP address from which you access the Site, the type of browser and operating system used, the date and time of your Site visit, and the Site pages you visit may be collected automatically; this information will not be used to identify you personally.
                        </li>

                        <li>
                            <strong>Information Sharing and Use</strong><br />
                            The name, email address, address, and zip code you enter on the Site will be shared with the participating organizations named on the Site. The participating organizations named on the Site may be updated at any time, including after you enter your information. Your email address and/or Site registration information may be used to offer you special commercial or other benefits and communicate with you in the future. Participating organizations may use the information you provide subject to each participating organization’s own privacy policies.
                        </li>

                        <li>
                            <strong>Permission to Call</strong><br />
                            By entering your phone number on the Site, you give express permission to call that phone number for the purpose of connecting you with legislators.
                        </li>

                        <li>
                            <strong>Website Use</strong><br />
                            You understand and agree that the Web Site is provided "AS-IS" and no guarantees are made for the performance of or your use of the site.
                        </li>

                    </ul>

                    <div className="effective-date">
                        Effective Date: July 6, 2015
                    </div>

                </div>

                <Logos />

                <Footer />
            </div>
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
        React.render(<TermsOfService />, document.getElementById('app'));
//    } else if (/^\/call\/?/.test(location.pathname)) {   // matches only to '/call/' pathname
    } else if (/\/call\/?/.test(location.pathname)) {
        React.render(<CallPage />, document.getElementById('app'));
    } else {
        React.render(<HomePage />, document.getElementById('app'));
    }
})();
