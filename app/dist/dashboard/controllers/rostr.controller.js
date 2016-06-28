(function() {
  'use strict';

  angular
    .module('dashboard')
    .controller('ClientOverviewController', ClientOverviewController);

    ClientOverviewController.$inject = ['user', '$scope'];

    function ClientOverviewController(user, $scope) {
      var vm = this;
      vm.bookmark;
      vm.user = user.current;
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


      vm.columns = [

          {
            name: "Pipeline",
            order: "pipelineStage"
          },
          {
            name: "Most Recent Activity",
            order: ""
          },
          {
            name: "Latest Reminder",
            order: ""
          },
          {
            name: "Latest Response",
            order: ""
          }
       ];


      vm.selectedColumns = [


      ];

      vm.query = {
        filter: '',
        order: 'username',
        limit: 15,
        page: 1
      }

      vm.pipelineOptions = [{type: "lead"}, {type: "trail"}, {type: "active-client"}, {type: "previous-client"},{type: "archived"},{type: "NA"} ];

      vm.addPipelineStage = function () {
        console.log("add pipeline to backend");
      }


      vm.removeFilter = function () {
        console.log(vm.query);
         vm.query.filter = '';

        //  if(vm.filter.form.$dirty) {
        //    vm.filter.form.$setPristine();
        //  }
      };

      vm.toggle = function (item, list) {
          var idx = list.indexOf(item);
          if (idx > -1)
              list.splice(idx, 1);
          else
              list.push(item);
      };
      ;
      vm.exists = function (item, list) {
          return list.indexOf(item) > -1;
      };
      ;
      vm.toggleAll = function () {
          if (this.selectedColumns.length === vm.columns.length) {
            this.selectedColumns = [];
          }
          else if (this.selectedColumns.length === 0 || this.selectedColumns.length > 0) {
            this.selectedColumns = vm.columns.slice(0);
          }
      };
      ;
      vm.isChecked = function () {
          return this.selectedColumns.length === vm.columns.length;
      };
      ;
      vm.isIndeterminate = function () {
          return (this.selectedColumns.length  !== 0 &&
              this.selectedColumns.length  !== vm.columns.length);
      };
      ;


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
      function getClients() {

      }

      // Apply the getClients result to vm
      function success(clients) {
        vm.clients = clients
      }

    }

})();
