//------------------------------------------------------------------------------
// Create browse passwords component
//------------------------------------------------------------------------------

const createBrowsePasswords = (views, id) => {
  const view = {
    component: null,
    query: '',
    id,
    views,

    //--------------------------------------------------------------------------
    // Initialize

    init: function () {
      this.component = $(`<section>`).attr('id', id);
      return this;
    },

    //--------------------------------------------------------------------------
    // Update

    update: function () {
      $.get(`/api/passwords${this.query}`).then(({ passwords }) => {
        this.component.empty();
        passwords.forEach((pwd) =>
          this.component.append(createPasswordCard(pwd, this.views))
        );
      });
      return this;
    },
  };

  view.init().update();
  views[id] = view;
};
