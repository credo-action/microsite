var state = {};
state.isMobile = /mobile/i.test(navigator.userAgent);


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


var EmailForm = React.createClass({displayName: "EmailForm",
    render: function() {
        return (
            React.createElement("form", {id: "petition", onSubmit:  this.onSubmit}, 
                React.createElement("h2", null, "Add your name"), 

                React.createElement("div", {className: "text-fields"}, 
                    React.createElement("input", {placeholder: "First and Last Name", name: "name"}), 
                    React.createElement("input", {placeholder: "Email", name: "email", "data-pattern-name": "email", type: "email"}), 
                    React.createElement("input", {placeholder: "Address", name: "address"}), 
                    React.createElement("input", {placeholder: "Zip Code", name: "zip", "data-pattern-name": "zip", type: "tel"})
                ), 

                React.createElement("div", {className: "disclaimer"}, 
                    React.createElement("label", null, 
                        React.createElement("input", {name: "consent", type: "checkbox"}), 

                        "I consent to being added to the email", 
                        React.createElement("br", null), 
                        "list of one or more participating orgs."
                    )
                ), 

                React.createElement("button", null, 
                    "Click to Sign"
                )
            )
        );
    },

    patterns: {
        zip: /^[0-9]*(-[0-9]+)?$/,
        email: /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}$/i,
    },

    onSubmit: function(e) {
        e.preventDefault();

        var inputs = this.getDOMNode().querySelectorAll('input');
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            var value = input.value.trim();

            if (!value) {
                alert('Please enter your ' + input.getAttribute('name') + '.');
                input.focus();
                return;
            }

            var patternName = input.getAttribute('data-pattern-name');
            if (patternName && this.patterns[patternName]) {
                var pattern = this.patterns[patternName];
                var regex = new RegExp(pattern);
                
                if (!regex.test(value)) {
                    alert('Please enter a valid ' + input.getAttribute('name') + '.');
                    input.focus();
                    return;
                }
            }
        }

        alert('TODO: Integrate with ActionKit.')
    },
});


var App = React.createClass({displayName: "App",
    renderDescription: function() {
        return (
            React.createElement("div", {className: "description"}, 
                React.createElement("h2", null, "Don't let Republicans start another Mideast war."), 

                "Sed sit amet ipsum mauris. ", React.createElement("a", {href: "#"}, "Maecenas"), " congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis. Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero in urna ultrices accumsan. Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In rutrum accumsan ultricies. Mauris vitae nisi at sem facilisis semper ac in est.", 

                React.createElement("div", {className: "spacer"}), 

                "Vivamus fermentum semper porta. Nunc diam velit, adipiscing ut tristique vitae, sagittis vel odio. Maecenas convallis ullamcorper ultricies. Curabitur ornare, ligula semper consectetur sagittis, nisi diam iaculis velit, id fringilla sem nunc vel mi. Nam dictum, odio nec pretium volutpat, arcu ante placerat erat, non tristique elit urna et turpis."
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
                        React.createElement("a", {className: "facebook", href: "#"}), 
                        React.createElement("a", {className: "twitter", href: "#"}), 
                        React.createElement("a", {className: "email", href: "#"})
                    )
                ), 

                React.createElement("div", {className: "meat"}, 

                    React.createElement("section", {className: "description-mobile"},  this.renderDescription() ), 

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
});


React.render(React.createElement(App, null), document.getElementById('app'));
