const pool = require('../db.js')

//get patient
const getUser =  async (req ,res) => {
    try {
      const [rows] = await pool.promise().query('SELECT a.account_id, a.password, a.name, a.birthDate, a.phoneNumber, a.gender, a.address, a.role_id, ip.p_id, ip.occupation, ip.allergy, ip.congenital_disease FROM account a LEFT JOIN information_patient ip ON a.account_id = ip.account_id;');
      if (rows.length === 0) {
        res.status(404).json({ error: 'user not found' });
      } else {
        res.json(rows); 
      }
    } catch (error) {
      return res.status(500).send(error.message);
    }
  };

//get case
const getCase = async (req ,res)=>{
    try{
      const [rows] = await pool.promise().query('SELECT * FROM `self_check-in`')
      if (rows.length === 0) {
        res.status(404).json({ error: 'No case found' });
      }else{
        res.json(rows); 
      }
    }catch(error){
      return res.status(500).send(error.message);
    }
  }

  //delete user
const deleteUser =  (req, res) => {
    const acc = parseInt(req.params.id);
    console.log(acc);
  
    pool.query('DELETE FROM account WHERE account_id = ?', [acc], (error, results) => {
      if (error) {
        return res.status(500).send(error.message);
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Account not found" });
      } else {
        return res.status(204).send();
      }
    });
  };

  const getPatientCase = async (req ,res)=>{
    const {currentAcc} = req.body
    try{
      const [rows] = await pool.promise().query('SELECT * FROM `self_check-in` WHERE account_id = ?' , [currentAcc])
      console.log(rows)
      if (rows.length === 0) {
        res.status(404).json({ error: 'No case found' });
      }else{
        res.json(rows); 
      }
    }catch(error){
      return res.status(500).send(error.message);
    }
  }

  //get patient
  const getCurrentUserInfo =  async (req ,res) => {
    const {currentAcc} = req.body;
    try {
      const [results] = await pool.promise().query('SELECT a.account_id, a.password, a.name, a.birthDate, a.phoneNumber, a.gender, a.address, a.role_id, ip.p_id, ip.occupation, ip.allergy, ip.congenital_disease FROM account a LEFT JOIN information_patient ip ON a.account_id = ip.account_id WHERE a.account_id = ?', [currentAcc]);
      const userInfo = results[0];
      if (!userInfo) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json(userInfo); 
      }
    } catch (error) {
      return res.status(500).send(error.message);
    }
  };

module.exports = {
  getUser , getCase , deleteUser , getPatientCase , getCurrentUserInfo
}