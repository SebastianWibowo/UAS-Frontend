var endpoint = 'http://localhost:3000/api/';
var app = angular.module('myApp', []);

app.controller('LoginController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    // Redirect if user is already logged in
    if(localStorage.getItem('token')) {
        $window.location.href = 'profile.html';
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
        $window.location.href = 'profile.html';
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

app.controller('ProfileController', ['$scope', '$http', function ($scope, $http) {
    $scope.profile = {};
    $scope.favoriteRecipes = [];
    $scope.isLoading = true;
    $scope.errorMessage = '';

    //menghapus akun
    $scope.deleteAccount = function () {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        const token = localStorage.getItem('token'); // Mendapatkan token dari localStorage

        // Konfigurasi header dengan Authorization
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        $http.delete(`${endpoint}delete`, config) // Memanggil endpoint delete
            .then(function (response) {
                alert(response.data.message);
                localStorage.removeItem('token'); // Hapus token setelah penghapusan
                window.location.href = 'index.html'; // Redirect ke halaman utama
            })
            .catch(function (error) {
                $scope.errorMessage = error.data.error || 'Failed to delete account.';
            });
    }
};

    // Periksa apakah token ada di localStorage
    $scope.isLoggedIn = !!localStorage.getItem('token');

    // Handle Login/Logout action
    $scope.handleAuth = function () {
        // Logout: Hapus token dan refresh halaman
        localStorage.removeItem('token');
        $scope.isLoggedIn = false;
        window.location.href = 'index.html'; // Redirect ke halaman utama
    };

    // Mendapatkan token dari localStorage
    const token = localStorage.getItem('token');

    // Konfigurasi header dengan Authorization
    const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }
    };
  
    // Memuat data profil dari API
    $http.get(`${endpoint}profile`, config)
        .then(function (response) {
            $scope.profile = response.data;
            
            // Jika ada favorit, ambil detail resep
            if ($scope.profile.favorites.length > 0) {
            const favoriteIds = $scope.profile.favorites;
        
            // Ambil detail semua favorit berdasarkan ID
            const favoriteRequests = favoriteIds.map(id => $http.get(`${endpoint}recipes/find/${id}`, config));
            $scope.isLoading = true; // Set loading sebelum mulai request

            Promise.all(favoriteRequests)
                .then(function (responses) {
                $scope.favoriteRecipes = responses.map(res => res.data);
                
                // Gunakan $apply() untuk memastikan AngularJS mendeteksi perubahan
                $scope.$apply(function () {
                    $scope.isLoading = false; // Set loading false setelah semua data favorit berhasil diambil
                });
                })
                .catch(function (error) {
                $scope.errorMessage = 'Failed to load favorite recipes.';
                $scope.$apply(function () {
                    $scope.isLoading = false; // Pastikan loading diset false meskipun ada error
                });
                });
            } else {
            $scope.favoriteRecipes = []; // Tidak ada favorit, set array kosong
            $scope.isLoading = false; // Tidak perlu loading lagi
            }
        })
        .catch(function (error) {
            if (error.status === 401) {
            $scope.errorMessage = 'Unauthorized. Please log in again.';
            localStorage.removeItem('token'); // Hapus token jika tidak valid
            // Redirect ke halaman login (opsional)
            window.location.href = 'login.html';
            } else {
            $scope.errorMessage = 'Failed to load profile data.';
            }
            $scope.$apply(function () {
            $scope.isLoading = false; // Pastikan status loading dimatikan jika terjadi error
            });
        });
}]);