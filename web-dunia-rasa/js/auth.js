var endpoint = 'http://localhost:3000/api/';
var app = angular.module('myApp', []);

app.controller('LoginController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    // Redirect if user is already logged in
    if(localStorage.getItem('token')) {
        $window.location.href = 'index.html';
    }

    $scope.loginData = {
        email: '',
        password: ''
    };

    $scope.errorMessage = '';

    $scope.login = function () {
    $http.post(`${endpoint}login`, $scope.loginData)
        .then(function (response) {
        // Jika login berhasil, redirect atau simpan token
        alert('Login successful!');
        localStorage.setItem('token', response.data.token); // Simpan token jika diperlukan
        window.location.href = './index.html'; // Ganti ke halaman tujuan setelah login
        })
        .catch(function (error) {
        // Tampilkan pesan error jika login gagal
        $scope.errorMessage = error.data.message || 'Login failed. Please try again.';
        });
    };
}]);

app.controller('RegisterController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    // Redirect if user is already logged in
    if(localStorage.getItem('token')) {
        $window.location.href = 'index.html';
    }
    $scope.registerData = {
      name: '',
      email: '',
      password: ''
    };
  
    $scope.successMessage = '';
    $scope.errorMessage = '';
  
    $scope.register = function () {
      $http.post(`${endpoint}register`, $scope.registerData)
        .then(function (response) {
          // Jika registrasi berhasil
          $scope.successMessage = 'Registration successful! You can now log in.';
          $scope.errorMessage = '';
          // Reset form
          $scope.registerData = {
            name: '',
            email: '',
            password: ''
          };
        })
        .catch(function (error) {
            console.log(error)
          // Tampilkan pesan error jika registrasi gagal
          $scope.successMessage = '';
          $scope.errorMessage = error.data.error || 'Registration failed. Please try again.';
        });
    };
}]);