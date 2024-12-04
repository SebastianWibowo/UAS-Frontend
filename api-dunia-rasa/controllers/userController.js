const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, name: user.name }, 'secretkey', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.profilUser = async (req, res) => {
  try {
    const userId = req.user.id;  // Mengambil userId dari req.user yang sudah di-set oleh middleware autentikasi

    // Cari pengguna berdasarkan ID
    const user = await User.findById(userId).select('-password');  // Menyaring field password untuk alasan keamanan

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mengirimkan data pengguna yang ditemukan
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//delete
exports.deleteUser  = async (req, res) => {
  try {
    const userId = req.user.id; // Ambil ID pengguna dari token yang terautentikasi

    // Hapus pengguna dari database
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User  deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};