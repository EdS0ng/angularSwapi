'use strict';

var myapp = angular.module('myapp', ["ui.router"]);

myapp.service('planetService', function (){
  var planets = [];
  this.populatePlanets = function (results){
    planets = results.map(planet => {
      planet.residents = planet.residents.map(resident => {
        var resident = { url: resident };
        resident.id = resident.url.match(/\d+/)[0];
        return resident;
      });
    return planet;
    });
  };
  this.getPlanets = function (){
    return planets;
  }
});

myapp.service('characterService', function (){
  var characters = {};
  this.getCharacter = function (key){
    return characters[key];
    console.log(characters[key]);
  }
  this.saveCharacter = function (person, id){
    var charId = id;
    //person.Id = id; 
    characters[charId]=person;
  }
  this.getAll = function (){
    return characters;
  }
})

myapp.controller("ResidentCtrl", function($scope, $http, $stateParams, characterService) {
  $scope.nextChar = Number($stateParams.id)+1;
  if(characterService.getCharacter($stateParams.id)){
    $scope.character = characterService.getCharacter($stateParams.id);
  }else{
    $http.get("http://swapi.co/api/people/" + $stateParams.id + "/?format=json").then(resp => {
        characterService.saveCharacter(resp.data, $stateParams.id);
        $scope.character = characterService.getCharacter($stateParams.id);
    });
  }

})

myapp.controller("PlanetCtrl", function($scope, $http, planetService, characterService) {
  if (planetService.getPlanets().length===0){
    $http.get("http://swapi.co/api/planets/?format=json").then(resp => {
      planetService.populatePlanets(resp.data.results);
      $scope.planets = planetService.getPlanets();

    }).catch(error => console.error(error.status));
  }else{
    $scope.characters = characterService.getAll();
    $scope.planets = planetService.getPlanets();
  }
});

myapp.config(function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise("/planets")

  $stateProvider
    .state('planets', {
        url: "/planets",
        templateUrl: "planets.html",
        controller: "PlanetCtrl"
    })
    .state('resident', {
        url: "/resident/:id",
        templateUrl: "resident.html",
        controller: "ResidentCtrl"
    })
})
