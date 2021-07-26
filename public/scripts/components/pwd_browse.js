//------------------------------------------------------------------------------
// Create browse passwords component
//------------------------------------------------------------------------------

const createBrowsePasswords = (views, id) => {
  views[id] = {
    component: $(`<section>`).attr('id', id),
    query: '',
    id,
    views,

    update: function () {
      $.get(`/api/passwords${this.query}`).then(({ passwords }) => {
        this.component.empty();
        passwords.forEach((pwd) =>
          this.component.append(createPasswordCard(pwd, this.views))
        );
      });
      return this.component;
    },
  };

  views[id].update();
};
