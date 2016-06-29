(function() {
  'use strict';

  angular
    .module('dashboard')
    .controller('ClientOverviewController', ClientOverviewController);

    ClientOverviewController.$inject = ['user', '$scope', '$mdToast', '$http', '$mdEditDialog'];

    function ClientOverviewController(user, $scope, $mdToast, $http, $mdEditDialog) {
      var vm = this;
      vm.bookmark;
      vm.user = user.current;
      vm.$mdToast = $mdToast;
      vm.$http = $http;


      //vm.clients2 = vm.user.clients;

      //vm.clients2[0].username = "Jon Snow";
      //vm.clients2[0].testResponses = ['Ghost', 'Longclaw', 'WinterFell'];
      ///vm.clients2[0].testReminder = ['Yes'];
      //vm.clients2[0].imgUrl = "/../../../assets/imgs/snow.png";

      vm.persons = [{
        username : "Jon Snow",
        pipelineStage : "Active-Client",
        testResponses :["Lord Commander of the Night's Watch", 'Longclaw', 'Winterfell'],
        reminderStatus : "/../../../assets/imgs/GoT/green.png",
        reminderQuestion: "Time for the battle of Winterfell!",
        testReminder : 'YES',
        imgUrl :"/../../../assets/imgs/GoT/snow.png"
      },
      {
        username : "Jaime Lannister",
        pipelineStage : "Trail",
        testResponses :["Lord Command of the King's Guard", 'Oathkeeper', 'Casterly Rock'],
        reminderStatus : "/../../../assets/imgs/GoT/green.png",
        reminderQuestion: "Did you take back riverrun?",
        testReminder : 'Yes, easy',
        imgUrl :"/../../../assets/imgs/GoT/jamie.png"
      },
      {
        username : "Tyrion Lannister",
        pipelineStage : "Active-Client",
        testResponses :["Dwarf", 'Axe', 'Casterly Rock'],
        reminderStatus : "/../../../assets/imgs/GoT/green.png",
        reminderQuestion: "Drinking time",
        testReminder : 'Of course',
        imgUrl :"/../../../assets/imgs/GoT/dwarf.png"
      },
      {
        username : "The Hound",
        pipelineStage : "Previous-Client",
        testResponses :[],
        reminderStatus : "/../../../assets/imgs/GoT/red.jpg",
        reminderQuestion : "Did you kill the boy?",
        testReminder : '',
        imgUrl :"/../../../assets/imgs/GoT/theHound.png"
      },
      {
        username : "Hodor",
        pipelineStage : "Active-Client",
        testResponses :['Hodor!', 'Hodor', 'Hodor...'],
        reminderStatus : "/../../../assets/imgs/GoT/orange.png",
        reminderQuestion: "Did you clean the horse?",
        testReminder : 'Hoder!',
        imgUrl :"/../../../assets/imgs/GoT/hodor.png"
      },
      {
        username : "Daenerys Targaryen",
        pipelineStage : "Lead",
        testResponses :["Mother of Dragons", "Dragons", "King's Landing"],
        reminderStatus : "/../../../assets/imgs/GoT/green.png",
        reminderQuestion: "It's time to feed the dragons",
        testReminder : 'Yes!',
        imgUrl :"/../../../assets/imgs/GoT/danny.jpg"
      }

    ];





      vm.possibleColumns = [];
      //vm.contents = contents(vm.clients);
      vm.selected = [];

      vm.testResponses = ['Good', 'nice']

      //Selecting the columns in the md-select
      vm.columns = [

          {
            index: "0",
            name: "Pipeline",
            order: "pipelineStage"
          },
          {
            index: "1",
            name: "Most Recent Activity",
            order: ""
          },
          {
            index: "2",
            name: "Latest Reminder",
            order: ""
          },
          {
            index: "3",
            name: "Latest Response",
            order: ""
          }
       ];

      //Selected the columns in the md-select
      vm.selectedColumns = [];

      vm.query = {
        filter: '',
        order: 'username',
        limit: 15,
        page: 1
      }

      //Used for the pipeline
      vm.pipelineOptions = [{type: "lead"}, {type: "trail"}, {type: "active-client"}, {type: "previous-client"},{type: "archived"},{type: "NA"} ];

      //Updating the pipeline
      vm.addPipelineStage = function (client) {
        console.log("add pipeline to backend");
        console.log(client);
        console.log($mdToast);
        if(!client.tempPipelineStage){
          console.log('No client');
        }
        else
        {
          var pipelineStage = {
            body: client.tempPipelineStage,
            author: vm.user.id,
            assignee: client.id
          }


          console.log(pipelineStage);

          //Will neeed to change when we update the backend. Need two post one to creat and another adding to the user.
          vm.$http.post('/api/pipelineStage/create/' + pipelineStage.assignee, pipelineStage).then(function successCallback(response) {
             console.log(response.data);
             console.log();
             console.log('HERE');
             //Does not update on front line on switch back but backend is good
             client.pipelineStage = response.data.body;
          });
          console.log(vm.user);
          this.openToast("Pipeline Stage Updated");

        }
      };

      //search engine filter
      vm.removeFilter = function () {
        console.log(vm.query);
         vm.query.filter = '';
      };



      //For the md-select and checkboxes all 5 methods
      vm.toggle = function (item, list) {
          var idx = list.indexOf(item);
          if (idx > -1)
              list.splice(idx, 1);
          else
              list.push(item);
      };

      vm.exists = function (item, list) {
          return list.indexOf(item) > -1;
      };

      vm.toggleAll = function () {
          if (this.selectedColumns.length === vm.columns.length) {
            this.selectedColumns = [];
          }
          else if (this.selectedColumns.length === 0 || this.selectedColumns.length > 0) {
            this.selectedColumns = vm.columns.slice(0);
          }
      };

      vm.isChecked = function () {
          return this.selectedColumns.length === vm.columns.length;
      };
      ;
      vm.isIndeterminate = function () {
          return (this.selectedColumns.length  !== 0 &&
              this.selectedColumns.length  !== vm.columns.length);
      };



      // $scope.$watch('vm.query.filter', function (newValue, oldValue) {
      //   if(!oldValue) {
      //     vm.bookmark = vm.query.page;
      //   }
      //
      //   if(newValue !== oldValue) {
      //     vm.query.page = 1;
      //   }
      //
      //   if(!newValue)  {
      //     vm.query.page = vm.bookmark;
      //   }
      //
      //   vm.getClients();
      // });

      // Get list of clients that match query

  //   vm.addNote = function (event, client) {
  //      // in case autoselect is enabled
  //   console.log("here lol");
  //   var editDialog = {
  //     modelValue:client.comment,
  //     placeholder: 'Add a comment',
  //     save: function (input) {
  //       if(input.$modelValue === 'Donald Trump') {
  //         return $q.reject();
  //       }
  //       if(input.$modelValue === 'Bernie Sanders') {
  //         return dessert.comment = 'FEEL THE BERN!'
  //       }
  //       dessert.comment = input.$modelValue;
  //     },
  //     targetEvent: event,
  //     title: 'Add a comment',
  //     validators: {
  //       'md-maxlength': 30
  //     }
  //   };
  // };

    vm.addNote = function (event, dessert) {
     // in case autoselect is enabled

      var editDialog = {
        modelValue: dessert.comment,
        placeholder: 'Add a comment',
        save: function (input) {
          if(input.$modelValue === 'Donald Trump') {
            return $q.reject();
          }
          if(input.$modelValue === 'Bernie Sanders') {
            return dessert.comment = 'FEEL THE BERN!'
          }
          dessert.comment = input.$modelValue;
        },
        targetEvent: event,
        title: 'Add a Note',
        validators: {
          'md-maxlength': 160
        }
      };

      var promise = $mdEditDialog.small(editDialog);

      promise.then(function (ctrl) {
        var input = ctrl.getInput();

        input.$viewChangeListeners.push(function () {
          input.$setValidity('test', input.$modelValue !== 'test');
        });
      });
    };















      function getClients() {

      }

      // Apply the getClients result to vm
      function success(clients) {
        vm.clients = clients
      }

    }

})();
