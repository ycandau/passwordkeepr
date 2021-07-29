//------------------------------------------------------------------------------
// Create a form to add or edit a password
//------------------------------------------------------------------------------

const createForm = (views, id, title) => {
  const view = {
    component: null,
    genOptions: new Set(['lower', 'upper', 'digits']),
    genLength: 16,
    genLengthMin: 16,
    pwd_id: -1,
    id,
    views,

    //--------------------------------------------------------------------------
    // Toggle methods and url for editing or adding

    submitMethod: function () {
      return this.id === 'edit' ? 'PUT' : 'POST';
    },

    submitUrl: function () {
      return this.id === 'edit'
        ? `/api/passwords/${this.pwd_id}`
        : '/api/passwords';
    },

    updateUrl: function () {
      return this.id === 'edit'
        ? `/api/users/filters?id=${this.pwd_id}`
        : '/api/users/filters';
    },

    //--------------------------------------------------------------------------
    // Clear

    clear: function () {
      this.component.find('input').val('');
      return this;
    },

    //--------------------------------------------------------------------------
    // Initialize

    init: function () {
      const $container = $('<section>').attr('id', this.id);
      this.component = $container;
      this.views[this.id] = this;

      const $form = $('<form>')
        .attr('id', `${this.id}-form`)
        .appendTo($container);

      // Set submit listener
      $form.on('submit', (event) => {
        event.preventDefault();

        // Send data to server
        $.ajax({
          method: this.submitMethod(),
          url: this.submitUrl(),
          data: $(`#${this.id}-form`).serialize(),
        }).then(() => {
          this.clear();
          this.views.menu.update();
          this.views.browse.update();
          this.views.setView('browse');
        });
      });

      return this;
    },

    //--------------------------------------------------------------------------
    // Update

    update: function () {
      // Ajax
      $.get(this.updateUrl()).then(({ orgs, categories, passwords }) => {
        // Dynamic field: Categories
        const $categories = $select(
          'Category:',
          `${this.id}-category-id`,
          'category_id',
          categories,
          'cat_id',
          'category'
        );

        // Dynamic field: Organizations
        const $orgs = $select(
          'Organization:',
          `${this.id}-org-id`,
          'org_id',
          orgs,
          'org_id',
          'org_name'
        );

        // Password generation buttons
        const $genButtons = $('<div class="gen">').append(
          $btnIcon('gen-pwd', 'angle-double-right'),
          $('<div class="vr">'),
          $button('lower toggle', 'a'),
          $button('upper toggle', 'A'),
          $button('digits toggle', '1'),
          $button('symbols toggle', '#'),
          $button('punct toggle', '?'),
          $button('brackets toggle', '()'),
          $('<div class="vr">'),
          $numberPicker('length', this.genLengthMin)
        );

        // Action buttons
        const $actionButtons = $('<div class="action">').append(
          $button('submit', 'Submit', 'submit'),
          $button('reset', 'Reset', 'reset'),
          $button('cancel', 'Cancel')
        );

        // Append
        const password = passwords ? passwords[0] : {};
        const $form = this.component.find('form');
        $form.empty();
        $form.append(
          $input('Site name', `${this.id}-name`, 'site_name', 'text', password),
          $input('Site URL', `${this.id}-url`, 'site_url', 'text', password),
          $input('Login', `${this.id}-login`, 'site_login', 'text', password),
          $orgs,
          $categories,
          $input('Password', `${this.id}-pwd`, 'site_pwd', 'text', password),
          $('<div class="label">Generate</div>'),
          $genButtons,
          $actionButtons
        );

        // Toggle generate options
        [...this.genOptions].forEach((option) => {
          $form.find(`.${option}`).addClass('on');
        });

        // Set length listeners
        $form.find('.increase').on('click', () => this.changeGenLength(1));
        $form.find('.decrease').on('click', () => this.changeGenLength(-1));

        // Set toggle listeners
        ['lower', 'upper', 'digits', 'symbols', 'punct', 'brackets'].forEach(
          (option) => {
            const $button = $form.find(`.gen .${option}`);
            $button.on('click', () => this.setGenOption(option));
          }
        );

        // Set generate listener
        $form.find('.gen-pwd').on('click', () => {
          $form
            .find(`#${this.id}-pwd`)
            .val(genPassword(this.genLength, this.genOptions));
        });

        // Set cancel listener
        $form.find('.cancel').on('click', () => {
          this.clear();
          this.views.setView('browse');
        });
      });

      return this;
    },

    //--------------------------------------------------------------------------
    // Change the generated password length

    changeGenLength: function (n) {
      this.genLength = Math.max(this.genLength + n, this.genLengthMin);
      this.component.find('.length .value').text(this.genLength);
    },

    //--------------------------------------------------------------------------
    // Set the generated password options

    setGenOption: function (option) {
      const $button = this.component.find(`.gen .${option}`);

      // Toggle off
      if ($button.hasClass('on')) {
        if (this.genOptions.size === 1) return;
        this.genOptions.delete(option);
        $button.removeClass('on');
        return;
      }

      // Toggle on
      this.genOptions.add(option);
      $button.addClass('on');
    },
  };

  view.init();
};