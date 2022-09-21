(function($) {
  var Scripts = {
    init() {
      let self = this;
      this.bindEvents();

      // Startup
      $(document).ready(function() {
        setTimeout(function() {
          $('html').addClass('loaded');
        }, 400);
      });      
    },


    bindEvents() {
      var self = this;

      // show PVC Modal
      $(document).on("click", "#show-modal", function(e) {
        e.preventDefault();
        $('.modal-container').removeClass('hidden');
      });

      // process PVC data
      $(document).on("submit", "form#add-pvc", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        let pvcData = self._processPvcForm( $('form#add-pvc').serializeArray() );

        let orderLines = self._getPvcOrderLines(pvcData);

        console.log("form data: ", pvcData);
        console.log("order lines: ", orderLines);

        self._showResults(orderLines);
      });

    },

    _clearPvcForm(){
      $('form#add-pvc')[0].reset();
    },

    _showResults(orderLines){
      $('#results').append('<h3>Adding to order:</h3>');

      orderLines.forEach((line) => {
        $('#results').append('<p>' + line + '</p>');
      });

      this._clearPvcForm();

      $('.modal-container').addClass('hidden');
    },

    _getPvcOrderLines(pvcData){
      let stringLines = [];

      if(pvcData.length){
        stringLines.push( pvcData.length + ' - ' + pvcData.diameterName + ' PVC ' + pvcData.type + ' conduit' );
      }

      for (var i = pvcData.data.length - 1; i >= 0; i--) {
        let pd = pvcData.data[i];

        if(pd.key.startsWith('e') ){
          pd.key = this._getPvcElbow(pd.key);
        }
        stringLines.push( pd.value + ' - ' + pvcData.diameterName + ' PVC ' + pvcData.type + ' - ' + pd.key );
      }

      return stringLines;
    },

    _processPvcForm(formData) {
      let data = [];
      let diameter, type, length;

      for (var i = formData.length - 1; i >= 0; i--) {
        let key = formData[i].name;
        let cleankey = key.replace('pvc-', '');
        let value = formData[i].value;


        // Pull out key data
        if(cleankey === 'diameter') {
          diameter = value;
          continue;
        }
        if(cleankey === 'type') {
          type = value;
          continue;
        }
        if(cleankey === 'length') {
          length = value;
          continue;
        }

        // drop all empty fields
        if(parseInt(value) === 0 || value === null || value === undefined){
          continue;
        }

        data.push({ 'key': cleankey, 'value': parseInt(value) });
      }

      return {
        diameter,
        diameterName: this._getPvcDiameter(diameter),
        type,
        length,
        data
      };

    },


    _getPvcDiameter(diameterCode){
      const diameterValues = {
        '075': '3/4 inch',
        '100': '1 inch',
        '125': '1 1/4 inch',
        '150': '1 1/2 inch',
        '200': '2 inch',
        '250': '2 1/2 inch',
        '300': '3 inch',
        '350': '3 1/2 inch',
        '400': '4 inch',
        '500': '5 inch'
      };

      return diameterValues[diameterCode];
    },

    _getPvcElbow(elbowCode){
      const elbowValues = {
        'e90s': '90 deg',
        'e9024': '90 deg 24in radius',
        'e9036': '90 deg 36in radius',
        'e45s': '45 deg',
        'e4524': '45 deg 24in radius',
        'e4536': '45 deg 36in radius'
      };

      return elbowValues[elbowCode];
    },

    _isMobile() {
      let mobileBreakpoint = 768;
      let vpw = $(window).width();
      return (vpw < mobileBreakpoint);
    },

  };

  Scripts.init();
})(jQuery);
