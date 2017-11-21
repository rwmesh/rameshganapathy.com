function catchSignupException(e, n) {
    var n = n || !0;
    try {
        return e()
    } catch (t) {
        "undefined" != typeof Bugsnag && Bugsnag.notifyException(t), n && setTimeout(function() {
            jQuery("#signup").get(0).submit()
        }, 3e3)
    }
}

function checkCookie() {
    var e = jQuery.cookie("EmailId");
    null != e && "" != e && (jQuery("#user_email").val(e), jQuery.cookie("EmailId", null))
}
window["signup-url"] || (window["signup-url"] = "https://man.freshpo.com/accounts/new_signup_free"), window["signup-thankyou-url"] || (window["signup-thankyou-url"] = "/signup/thank-you"),
    function($) {
        function toggleText(e) {
            return currentText = "Please wait..." == e ? "Creating your Account" : "Please wait..."
        }

        function isDST() {
            var e = new Date,
                n = new Date(e.getFullYear(), 0, 1, 0, 0, 0, 0),
                t = new Date(e.getFullYear(), 6, 1, 0, 0, 0, 0),
                r = n.toGMTString(),
                a = new Date(r.substring(0, r.lastIndexOf(" ") - 1));
            r = t.toGMTString();
            var i = new Date(r.substring(0, r.lastIndexOf(" ") - 1)),
                o = (n - a) / 36e5,
                s = (t - i) / 36e5;
            return s != o
        }

        function getLocalTimeZoneOffset() {
            var e = -1 * ((new Date).getTimezoneOffset() / 60);
            return e -= isDST() ? 1 : 0
        }
        var TRANSLATED = TRANSLATED || {
                messages: {
                    "account[name]": {
                        required: "You'll need to tell us where you work",
                        minlength: "Company name should exceed 2 characters"
                    },
                    "account[domain]": {
                        required: "Give your helpdesk a name",
                        maxlength: "Helpdesk name shouldn't exceed 25 characters",
                        subdomain: "Only letters, numbers and hyphen allowed"
                    },
                    "user[email]": {
                        required: "Please enter a valid email",
                        email: "Please enter a valid email"
                    }
                },
                already_exists: "This Helpdesk already exists",
                email_like: "This Helpdesk already exists",
                thankyoumsg: ["Setting up your self service portal", "Cranking up your knowledge base", "Configuring your Community Platform", "_redirect"]
            },
            timeoutId, currentText = "Please wait ....",
            firstRequest = !1;
        $.validator.addMethod("subdomain", function(e, n) {
            var t = /[^a-zA-Z0-9\-]/;
            return this.optional(n) || !t.test(e.replace(/^\s*|\s*$/g, ""))
        }, "Only letters, numbers and hyphen allowed."), $("#signup").validate({
            highlight: function(e) {
                $(e).parents(".textfield").addClass("error")
            },
            unhighlight: function(e) {
                $(e).parents(".textfield").removeClass("error")
            },
            errorPlacement: function(e, n) {
                $(n).parents(".textfield").append(e)
            },
            errorElement: "em",
            onkeyup: !1,
            rules: {
                "account[name]": {
                    required: !0,
                    minlength: 3
                },
                "account[domain]": {
                    required: !0,
                    maxlength: 25,
                    subdomain: !0
                },
                "user[email]": {
                    required: !0,
                    email: !0
                },
                "user[name]": {
                    required: !0
                },
                "user[first_name]": {
                    required: !0
                },
                "user[last_name]": {
                    required: !0
                }
            },
            messages: TRANSLATED.messages,
            submitHandler: function(e) {
                return firstRequest || catchSignupException(function() {
                    $("#session_json").val(JSON.stringify(session)), $("#first_referrer").val($.cookie("fd_fr") || ""), $("#first_landing_url").val($.cookie("fd_flu") || ""), $("#first_search_engine").val($.cookie("fd_se") || ""), $("#first_search_query").val($.cookie("fd_sq") || ""), $("#pre_visits").val($.cookie("fd_vi") || 0), $("#account_timezone_offset").val(getLocalTimeZoneOffset()), $("#error_container").empty().hide();
                    var n = $(e).serialize(),
                        t = {
                            dataType: "jsonp",
                            url: window["signup-url"] + "?callback=?",
                            data: n,
                            success: signupResponse,
                            crossDomain: !0
                        };
                    $.ajax(t), $("#loading_data").show();
                    var r = $("#signup_button");
                    r.attr("disabled", !0).addClass("btn-disabled btn-loading").data("originalText", r.val()).val(r.data("loadingText") || "Please wait..."), timeoutId = setInterval(function() {
                        var e = toggleText(currentText);
                        $("#signup_button").val(r.data("loadingText") || e)
                    }, 5e3), firstRequest = !0
                }), !1
            }
        }), $.validator.prototype.hideErrors = function() {
            this.addWrapper(this.toHide).slideUp()
        }, checkCookie(), $("#signup .textfield input").on({
            focus: function() {
                $(this).parents(".textfield").addClass("active")
            },
            blur: function() {
                $(this).parents(".textfield").removeClass("active")
            },
            keyup: function() {
                var e = $(this);
                setTimeout(function() {
                    e.parents(".textfield").toggleClass("presence", "" !== e.val())
                }, 0)
            }
        }), $("#signup").click(function() {
            window.setTimeout(function() {
                $(".whitebg").removeClass("animate")
            }, 1300)
        }), $("#account_domain").on("keyup keydown keypress change", function() {
            var e = $(this).val();
            "" != e.trim() ? $("#domain_url").text(e) : $("#domain_url").text("domain-name")
        });
        var showErrors = function(errors) {
                errors = eval(errors), $("#error_container").empty(), clearInterval(timeoutId), timeoutId = 0, combined_errors = {}, $.each(errors, function(e, n) {
                    combined_errors["" + n[0]] = n[1]
                });
                for (key in combined_errors) {
                    var error_message = combined_errors[key];
                    "account_domain" == key && ($("#account_domain").addClass("error"), key = "", error_message = TRANSLATED.already_exists), "base" == key && ($("#user_email").addClass("error"), key = "", error_message = TRANSLATED.email_like), $("<label />").append(" " + error_message).appendTo("#error_container")
                }
                $("#error_container").show(), $("#error_container").addClass("has_errors");
                var $btn = $("#signup_button");
                $btn.attr("disabled", !1).removeClass("submit-btn-disabled btn-disabled btn-loading").val($btn.data("originalText") || "Please try again...")
            },
            showSuccess = function(e) {
                e = window["signup-thankyou-url"] + "?redirect=" + encodeURIComponent(e) + "&account=" + jQuery("#account_domain").val();
                var n = document.createElement("a");
                return n.click ? (n.setAttribute("href", e), n.style.display = "none", document.body.appendChild(n), n.click(), void 0) : (window.location = e, void 0)
            },
            signupResponse = function(e) {
                catchSignupException(function() {
                    e.success ? showSuccess(e.url) : showErrors(e.errors), firstRequest = !1, $("#loading_data").hide()
                }, !1)
            },
            signupFailure = function() {
                var e = $("<input type='hidden' name='backend_response' value='failure' />"),
                    n = $("#signup");
                n.append(e), n.get(0).submit()
            };
        $("#account_name").change(function() {
            "" === $("#account_domain").val() && ($("#account_domain").val($(this).val().toLowerCase().replace(/\W/g, "")), $("#account_domain").trigger("change"))
        }), $("#account_domain").change(function() {
            $(this).val($(this).val().toLowerCase().replace(/\W/g, ""))
        }), $(".error").removeClass("error"), "function" != typeof String.prototype.trim && (String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, "")
        })
    }(jQuery);