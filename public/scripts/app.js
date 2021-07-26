//------------------------------------------------------------------------------
// Main client side script
//------------------------------------------------------------------------------

const createViews = (parent) => ({
  parent,
  current: null,

  append: function (...views) {
    const comps = views.map((view) => this[view].component);
    this.parent.append(comps);
  },

  setView: function (view) {
    const newComp = this[view].component;
    if (newComp === this.current) return;
    if (this.current) this.current.detach();
    this.current = newComp;
    this.parent.append(this.current);
  },
});

$(() => {
  const views = createViews($('#body'));

  createNavbar(views, 'navbar');
  createSidebar(views, 'sidebar');
  createBrowsePasswords(views, 'browse');
  createEditPassword(views, 'edit');
  createAddPassword(views, 'add');

  views.append('navbar', 'sidebar');
  views.setView('browse');
});
