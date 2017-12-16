// Navbar toggling
$('.navbar-toggler').click(function() {
	$(this).toggleClass('open');
});

// Sign in & join modal
var authModal = $('#modal-auth');
var authModalPanes = authModal.find('.auth-box');

// Trigger auth modal
// start on the right pane
// defaults to "join"
// options "signin" | "join" | "password"
window.signinModalTrigger = function signinModalTrigger(e) {
	e.preventDefault();

	var initial = $(this).data("initial") || 'join';
	var initialPane = authModal.find('.modal-pane-' + initial);
	var from = $(this).data("from");

	authModal.modal('show');

	authModalPanes.hide();
	initialPane.show();

	// Only focus the first field on large devices where showing
	// the keyboard isn't a jarring experience
	if ($(window).width() >= 768) initialPane.find('input[type!=hidden],textarea').eq(0).click().focus();

	if (from) authModal.find('[name="from"]').val(from);
}

$("[href='#modal-auth'], [data-modal='auth'], .auth-trigger").on('click', signinModalTrigger);	// eslint-disable-line no-undef

// Move between auth panes
$("[rel='modal-pane']").click(function() {
	var switchTo = authModal.find('.modal-pane-' + $(this).data("modal-pane"));

	authModalPanes.hide();
	switchTo.show();

	// only focus the first field on large devices where showing
	// the keyboard isn't a jarring experience
	if ($(window).width() >= 768) {
		switchTo.find('input[type!=hidden],textarea').eq(0).click().focus();
	}
});
