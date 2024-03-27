const pool = require('../db.js')
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'ICE_MENTOS';

// Login Route
const login =  async (req, res) => {
    const { username, password } = req.body;
    try {
      const [rows] = await pool.promise().query('SELECT * FROM account WHERE account_id = ? AND password = ?', [username, password]);
      if (rows.length > 0) {
        const user = rows[0];
        // Create token
        const token = jwt.sign({ account_id: user.account_id, name: user.name ,role_id:user.role_id}, JWT_SECRET, { expiresIn: '1h' }); // Adjust payload and expiration as needed
        res.json({ token }); // Send the token to the client
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).send('Internal Server Error');
    }
  }; 

//decode token
const decodeToken = async (req, res) => {
    const { token } = req.body;
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      res.json({ message: 'decoded success', decoded: decoded });
    });
};

//Register User
const userRegister =  async (req, res) => {
  const { formData } = req.body;
  if (!formData) {
    return res.status(400).json({ error: 'Data is required' });
  }

  const query1 = 'INSERT INTO account (password, name, birthDate, phoneNumber, gender, address, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const params1 = [formData.password, formData.name, formData.birthDate, formData.phoneNumber, formData.gender, formData.address, formData.roleId];

  pool.query(query1, params1, (error, results) => {
    if (error) {
      console.error('Error adding user:', error);
      return res.status(500).json({ error: 'Error adding user' });
    }

    // สำหรับ roleId == 'P', ให้ดำเนินการเพิ่มข้อมูลลงใน information_patient
    if (formData.roleId == 'P') {
      const acc_id = results.insertId;
      // console.log(typeof acc_id)
      const query2 = 'INSERT INTO information_patient (p_id, account_id, occupation, allergy, congenital_disease) VALUES (?, ?, ?, ?, ?)';
      const params2 = [formData.pId, acc_id, formData.occupation, formData.allergy, formData.congenitalDisease];

      pool.query(query2, params2, (error) => {
        if (error) {
          console.error('Error adding user Info:', error);
          return res.status(500).json({ error: 'Error adding user info' });
        }

        return res.status(201).json({ success: true, message: 'User info added successfully', userId: results.insertId });
      });
    } else {
      // ถ้า roleId != 'P', ส่ง response ทันทีหลังจากเพิ่มผู้ใช้ใหม่
      return res.status(201).json({ success: true, message: 'User added successfully', userId: results.insertId });
    }
  });
};


//UpdateUser
const userUpdate = async (req, res) => {
  const { formData, userId } = req.body;
  if (!formData || !userId) {
    return res.status(400).json({ error: 'Data and userId are required' });
  }

  const query1 = 'UPDATE account SET password = ?, name = ?, birthDate = ?, phoneNumber = ?, gender = ?, address = ?, role_id = ? WHERE account_id = ?';
  const params1 = [formData.password, formData.name, formData.birthDate, formData.phoneNumber, formData.gender, formData.address, formData.roleId, userId];

  pool.query(query1, params1, (error, results) => {
    if (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ error: 'Error updating user' });
    }

    // Check if the affectedRows is 0, meaning no rows were updated (user not found).
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // For roleId == 'P', proceed to update information in information_patient.
    if (formData.roleId == 'P') {
      const query2 = 'UPDATE information_patient SET occupation = ?, allergy = ?, congenital_disease = ? WHERE account_id = ?';
      const params2 = [formData.occupation, formData.allergy, formData.congenitalDisease, userId];

      pool.query(query2, params2, (error) => {
        if (error) {
          console.error('Error updating user info:', error);
          return res.status(500).json({ error: 'Error updating user info' });
        }

        return res.status(200).json({ success: true, message: 'User info updated successfully' });
      });
    } else {
      // If roleId != 'P', send response immediately after updating the user.
      return res.status(200).json({ success: true, message: 'User updated successfully' });
    }
  });
};

module.exports = {
    login , decodeToken , userRegister , userUpdate
}